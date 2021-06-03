import { from, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { skipInteractionWarning } from '../shared/interaction-warning';
import { log } from '../shared/logger';
import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';
import { getPokedex, Pokedex } from './dexchecker';
import { PokemonWithField, User } from './party.interacter';
import { LEGENDARIES } from "../shared/items.const";


export interface Field {
    id: string;
    name: string;
    type: string;
    icon: string;
    lock: string;
    count: string;
}

export function getFields(username: string): Observable<Field[]> {
    return sendServerRequest('https://pokefarm.com/fields/fieldlist', RequestMethod.Post, `{\"uid\":\"${username}\"}`).pipe(
        map(res => {
            return JSON.parse(res as any).fields;
        })
    );
}

export function getAllFieldPokemonsFromUser(user: User, fieldWhiteList?: string[]): Observable<PokemonWithField[]> {
    return getFields(user.url).pipe(
        switchMap(fields => from(fields)),
        filter(field => {
            if (fieldWhiteList) {
                return fieldWhiteList.filter(fieldWhite => field.name === fieldWhite).length > 0;
            } else {
                return true;
            }
        }),
        switchMap(field =>
            sendServerRequestAndGetHtml(
                'https://pokefarm.com/fields/field',
                RequestMethod.Post,
                true,
                `{"id":${field.id},"uid":"${user.url}","mode":"public"}`
            ).pipe(
                map(body => {
                    const data = body.querySelectorAll('.fieldmon');
                    return data.map(mon => {
                        return <PokemonWithField>{
                            monsterid: mon.attributes['data-id'],
                            isEgg: false,
                            taste: mon.attributes['data-flavour'].split('-')[0],
                            name: body.querySelector(`a[href="/summary/${mon.attributes['data-id']}"]`).innerText,
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
                return getAllFieldPokemonsFromUser({ url: process.env.pfqusername as string, name: process.env.pfqusername as string }, ['Temp']).pipe(
                    switchMap(pokemons => from(pokemons)),
                    // Pokemon in this Observable will be released
                    // Pokemon are kept in this Observable for releasing if they are not rare and are not needed for the Pokedex

                    // Only keeps Pokemon to release that are not legendary
                    filter(pokemon => {
                        const isLegendary: boolean = LEGENDARIES.includes(pokemon.name); //TODO is name == species?
                        if (isLegendary) {
                            log(`[KEEP] Pokemon ${pokemon.monsterid} (${pokemon.name}) is a legendary Pokemon.`);
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
                                    log(`[KEEP] Pokemon ${pokemon.monsterid} (${pokemon.name}) has a rare tag.`);
                                }
                                return !pokemonHasRareTag;
                            }),
                            map(_ => pokemon)
                        );
                    }),

                    // Only keeps Pokemon to release that can't evolve or that don't need to evolve for the Pokedex
                    switchMap(pokemon => {
                        skipInteractionWarning().subscribe();
                        return sendServerRequestAndGetHtml('https://pokefarm.com/summary/' + pokemon.monsterid, RequestMethod.Get).pipe(
                            map(htmlBody => {
                                pokemon.isTooYoungToBeReleased = htmlBody.querySelectorAll('[data-when]').length === 1;
                                pokemon.isFinalForm = htmlBody.querySelectorAll('[data-menu="evocheck"]').length === 0;
                                return pokemon;
                            }),

                            // Only keeps Pokemon to release that are all of this
                            // 1) NOT too young to be released,
                            // 2) in final form,
                            // 3) not in final form but their evolution is already in pokedex
                            filter(pokemon => {
                                if (pokemon.isTooYoungToBeReleased) {
                                    log(`[KEEP] Pokemon ${pokemon.monsterid} (${pokemon.name}) is too young to be released, regardless of evolution checks.`);
                                    return false;
                                    // TODO do something else with this pokemon
                                }

                                if (pokemon.isFinalForm) {
                                    log(`${pokemon.monsterid} (${pokemon.name}) is in final form and can be released.`);
                                    return true;
                                }


                                // TODO should check all forms
                                // TODO should check evolution of evolution --> if neither id+1 nor id+2 can hatch from eggs
                                // Check if pokemon evolution is already in pokedex
                                const nextFormID = Number(pokedex.filter(entry => entry.name === pokemon.name)[0].id) + 1;
                                const nextForms = pokedex.filter(entry => entry.id == nextFormID.toString());

                                if (nextForms.length === 0) {
                                    // Dont know what went wrong \_(0.0)_/ (id maybe not a number)
                                    return false; // pokemon can not evolve according to Pokedex; keep in field
                                } else {
                                    if (nextForms[0].isInDex(Pokedex.pokedex)) {
                                        log(`Pokemon ${pokemon.monsterid} (${pokemon.name}) is not in final form but next form ${nextForms[0].name} is already in pokedex.`);
                                    } else {
                                        log(`[KEEP] Pokemon ${pokemon.monsterid} (${pokemon.name}) is not in final form and should be kept to evolve into form ${nextForms[0].name}.`);
                                    }
                                    return nextForms[0].isInDex(Pokedex.pokedex);
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
