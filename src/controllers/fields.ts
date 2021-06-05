import { EMPTY, from, Observable } from 'rxjs';
import { filter, map, retry, switchMap, tap } from 'rxjs/operators';

import { skipInteractionWarning } from '../shared/interaction-warning';
import { log } from '../shared/logger';
import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';
import { getPokedex, Pokedex } from './dexchecker';
import { PokemonWithField, User } from './party.interacter';
import { LEGENDARIES } from "../shared/items.const";
import { evolvePokemonWithStone } from "./eggs";


export interface Field {
    positionid: string;
    id: string;
    name: string;
    type: string;
    icon: string;
    lock: string;
    count: string;
}

export function getFieldsWithName(username: string, names: string[]): Observable<Field[]> {
    return getFields(username).pipe(
        map(fieldsArray => fieldsArray.filter(field => names.includes(field.name)))
    )
}

export function getFields(username: string): Observable<Field[]> {
    return sendServerRequest('https://pokefarm.com/fields/fieldlist', RequestMethod.Post, `{\"uid\":\"${username}\"}`).pipe(
        map(res => {
            return JSON.parse(res as any).fields;
        }),
        map(fields => {
            for (let i = 0; i < fields.length; i++) {
                fields[i].positionid = i;
            }
            return fields;
        })
    );
}

export function movePokemonToNamedField(pokemonID: string, fieldName: string) {
    return getFieldPositionByName(process.env.pfqusername as string, fieldName).pipe(
        switchMap(fieldPos => {
            if (fieldPos > 0) {
                return sendServerRequest('https://pokefarm.com/fields/movetofield', RequestMethod.Post, `{"id":"${pokemonID}", "field":${fieldPos}, "getEmptySlot":true}`);
            } else {
                return EMPTY;
            }
        }),
        tap(res => {
            const result = JSON.parse(res as any);
            if (!result.ok) {
                log(result.error);
            }
        })
    )
}

export function movePokemonToEvolutionField(pokemon: PokemonWithField) {
    return sendServerRequestAndGetHtml("https://pokefarm.com/summary/evocheck", RequestMethod.Post, true, `{"id": "${pokemon.monsterid}"}`).pipe(
        map(htmlBody => {
            // console.log(htmlBody.innerText); Actually pretty neat log.
            const methods: string[] = ['Happiness', 'Trade', 'Level', 'Stone', 'Orb', 'Field', 'Sweet'];
            let method: string = 'EVO'
            methods.forEach(potentialMethod => {
                if (htmlBody.innerText.indexOf(potentialMethod) !== -1) {
                    method = potentialMethod;
                }
            })

            log(`[${method}] Pokemon ${pokemon.monsterid} (${pokemon.name}) can evolve by ${method}.`);
            if (method === "Stone") {
                evolvePokemonWithStone(pokemon, htmlBody.innerText).subscribe(); // Problem when evolving: it will evolve all of the same species, because the dex doesnt get updated, which results in using many stones -> buy 100 of every stone before starting
            }
            movePokemonToNamedField(pokemon.monsterid, method).subscribe();
        }),
    )
}


function getFieldPositionByName(userurl: string, fieldName: string): Observable<Number> {
    return getFields(userurl).pipe(
        map(fields => {
            if (!!fields) {
                //TODO can probably be refactored with new "positionID" attribute
                const fieldPosition = fields.findIndex(field => field.name === fieldName && Number(field.count) < 40);
                if (fieldPosition == -1) {
                    log(`No field with name ${fieldName} and enough space was found.`);
                }
                return fieldPosition;
            } else {
                log(`No fields received for user [${userurl}]`);
                return -1;
            }
        })
    )
}

export function getAllFieldPokemonsFromUser(user: User, fieldWhiteList?: string[]): Observable<PokemonWithField[]> {
    const fields = fieldWhiteList ? getFieldsWithName(user.url, fieldWhiteList) : getFields(user.url);
    return fields.pipe(
        switchMap(fields => from(fields)),
        switchMap(field =>
            sendServerRequestAndGetHtml(
                'https://pokefarm.com/fields/field',
                RequestMethod.Post,
                true,
                `{"id":${field.positionid},"uid":"${user.url}","mode":"public"}`
            ).pipe(
                map(body => {
                    const data = body.querySelectorAll('.fieldmon');
                    return data.map(mon => {
                        const speciesApproximation = body.querySelector(`a[href="/summary/${mon.attributes['data-id']}"]`).parentNode.parentNode.innerText;
                        return <PokemonWithField>{
                            monsterid: mon.attributes['data-id'],
                            isEgg: false,
                            taste: mon.attributes['data-flavour'].split('-')[0],
                            name: body.querySelector(`a[href="/summary/${mon.attributes['data-id']}"]`).innerText,
                            species: speciesApproximation.substring(speciesApproximation.indexOf(":") + 1, speciesApproximation.lastIndexOf("Type:")).trim(),
                            fieldid: field.id
                        };
                    });
                }),
                filter(mons => !!mons.length)
            )
        )
    );
}

/** Releases every pokemon from "Temp" fields that are in final stage */
export function finalStageRelease() {
    const notToRelease = ['ALBINO', 'SHINY', 'STARTER'];

    let released = 0;

    getPokedex()
        .pipe(
            switchMap(pokedex => {
                return getAllFieldPokemonsFromUser({ url: process.env.pfqusername as string, name: process.env.pfqusername as string }, ['EVO']).pipe(
                    switchMap(pokemons => from(pokemons)),
                    // Pokemon in this Observable will be released
                    // Pokemon are kept in this Observable for releasing if they are not rare and are not needed for the Pokedex

                    // Only keeps Pokemon to release that are not legendary
                    filter(pokemon => {
                        const isLegendary: boolean = LEGENDARIES.includes(pokemon.species) || LEGENDARIES.includes(pokemon.name); // check both for extra security
                        if (isLegendary) {
                            log(`[LEGENDARY] Pokemon ${pokemon.monsterid} (${pokemon.name}) is a legendary Pokemon. Moving it...`);
                            movePokemonToNamedField(pokemon.monsterid, "LEGENDARY").subscribe()
                        }
                        return !isLegendary;
                    }),

                    // Only keeps Pokemon to release that are not rare (a rare pokemon contains one of notToRelease tags on summary)
                    switchMap(pokemon => {
                        return sendServerRequestAndGetHtml('https://pokefarm.com/summary/' + pokemon.monsterid, RequestMethod.Get).pipe(
                            filter(htmlBody => {
                                // Set pokemon name
                                const pokemonTags: string[] = htmlBody
                                    .querySelectorAll('.name')
                                    .map(element => element.childNodes.map(child => (child as any)._rawAttrs))[0]
                                    .map(attr => attr?.title)
                                    .filter(tag => !!tag)
                                    .map(tag => tag.replace(/[^A-Z]/g, ''));

                                const pokemonHasRareTag: boolean = pokemonTags.filter(tag => notToRelease.includes(tag)).length > 0;


                                if (pokemonHasRareTag) {
                                    log(`[RARE] Pokemon ${pokemon.monsterid} (${pokemon.name}) has a rare tag.`);
                                    movePokemonToNamedField(pokemon.monsterid, "RARE").subscribe()
                                }
                                return !pokemonHasRareTag;
                            }),
                            map(_ => pokemon),
                            retry(1)
                        );
                    }),

                    // Only keeps Pokemon to release that can't evolve or that don't need to evolve for the Pokedex
                    switchMap(pokemon => {
                        skipInteractionWarning().subscribe();
                        return sendServerRequestAndGetHtml('https://pokefarm.com/summary/' + pokemon.monsterid, RequestMethod.Get).pipe(
                            map(htmlBody => {
                                pokemon.isTooYoungToBeReleased = htmlBody.querySelectorAll('[data-when]').length === 1;
                                pokemon.isFinalForm = htmlBody.querySelectorAll('[data-menu="evocheck"]').length === 0; //TODO: Check for " (Final)" because of "Stage: Stage 1 Pokémon (Final)"
                                return pokemon;
                            }),

                            // Only keeps Pokemon to release that are all of this
                            // 1) NOT too young to be released,
                            // 2) in final form,
                            // 3) not in final form but their evolution is already in pokedex
                            filter(pokemon => {
                                if (pokemon.isTooYoungToBeReleased) {
                                    log(`[WAIT] Pokemon ${pokemon.monsterid} (${pokemon.name}) is too young to be released, regardless of evolution checks.`);
                                    //movePokemonToNamedField(pokemon.monsterid, "TOOYOUNG")
                                    return false;
                                }

                                if (pokemon.isFinalForm) {
                                    log(`[RELEASE] ${pokemon.monsterid} (${pokemon.name}) is in final form and can be released.`);
                                    return true;
                                }


                                // TODO should check all forms
                                // Check if pokemon evolution is already in pokedex
                                const currentPokemonID = Number(pokedex.filter(entry => entry.name === pokemon.name)[0].id);
                                const nextForms = pokedex.filter(entry => {
                                    // When currentPokemonID is not at finalStage, then currentPokemonID+1 is most definitely an evolution.
                                    // When currentPokemonID+1 is an evolution, currentPokemonID+2 should be an evolution, too, if it can not hatch form an egg.
                                    return (entry.id == (currentPokemonID + 1).toString() || entry.id == (currentPokemonID + 2).toString())
                                        && !entry.eggs;
                                });

                                if (nextForms.length === 0) {
                                    // Dont know what went wrong \_(0.0)_/ (id maybe not a number)
                                    return false; // pokemon can not evolve according to Pokedex, but is not at final stage according to HTMLdom; keep in field
                                } else if (nextForms.length === 1) {
                                    if (nextForms[0].isInDex(Pokedex.pokedex)) {
                                        log(`[RELEASE] ${pokemon.monsterid} (${pokemon.name}) is not in final form but next form ${nextForms[0].name} is already in pokedex.`);
                                    } else {
                                        log(`[EVOLUTION] Pokemon ${pokemon.monsterid} (${pokemon.name}) should be kept to evolve into form ${nextForms[0].name}. Moving it...`);
                                        movePokemonToEvolutionField(pokemon).subscribe()
                                    }
                                    return nextForms[0].isInDex(Pokedex.pokedex);
                                } else {
                                    if (nextForms[0].isInDex(Pokedex.pokedex) && nextForms[1].isInDex(Pokedex.pokedex)) {
                                        log(`[RELEASE] ${pokemon.monsterid} (${pokemon.name}) is not in final form but next forms ${nextForms[0].name} and ${nextForms[1].name} are already in pokedex.`);
                                    } else {
                                        log(`[EVOLUTION] Pokemon ${pokemon.monsterid} (${pokemon.name}) should be kept to evolve into one if its next forms ${nextForms[0].name} or ${nextForms[1].name}. Moving it...`);
                                        movePokemonToEvolutionField(pokemon).subscribe()
                                    }
                                    return nextForms[0].isInDex(Pokedex.pokedex) && nextForms[1].isInDex(Pokedex.pokedex);
                                }
                            })
                        );
                    }),
                    switchMap(pokemon => {
                        return sendServerRequest('https://pokefarm.com/summary/release', RequestMethod.Post, JSON.stringify({ pid: pokemon.monsterid })).pipe(
                            map(res => JSON.parse(res as any).key),
                            switchMap(key =>
                                sendServerRequest(
                                    'https://pokefarm.com/summary/release',
                                    RequestMethod.Post,
                                    JSON.stringify({ pid: pokemon.monsterid, confirm: key })
                                ).pipe(map(res => JSON.parse(res as any)))
                            )
                        );
                    })
                );
            })
        )
        .subscribe(res => {
            if (res.ok) {
                ++released;
                log(`Released a pokemon (${released})`);
            } else {
                log(`[ERROR] ${res.error}`);
            }
        });
}
