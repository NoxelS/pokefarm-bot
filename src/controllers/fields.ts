import { from, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { log } from '../shared/logger';
import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';
import { getPokedex } from './dexchecker';
import { PokemonWithField, User } from './party.interacter';


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

    var released = 0;

    getPokedex()
        .pipe(
            switchMap(pokedex => {
                return getAllFieldPokemonsFromUser({ url: process.env.pfqusername as string, name: process.env.pfqusername as string }, ['Temp']).pipe(
                    switchMap(pokemons => from(pokemons)),

                    // Filters our every rare pokemon (a rare pokemon contains one of notToRelease tags on summary)
                    switchMap(pokemon => {
                        return sendServerRequestAndGetHtml('https://pokefarm.com/summary/' + pokemon.monsterid, RequestMethod.Get).pipe(
                            filter(htmlBody => {
                                // Set pokemon name
                                return (
                                    htmlBody
                                        .querySelectorAll('.name')
                                        .map(element => element.childNodes.map(child => (child as any)._rawAttrs))[0]
                                        .map(attr => attr?.title)
                                        .filter(title => !!title)
                                        .map(title => title.replace(/[^A-Z]/g, ''))
                                        .filter(title => notToRelease.includes(title)).length === 0
                                );
                            }),
                            map(_ => pokemon)
                        );
                    }),

                    switchMap(pokemon => {
                        return sendServerRequestAndGetHtml('https://pokefarm.com/summary/' + pokemon.monsterid, RequestMethod.Get).pipe(
                            map(htmlBody => {
                                // Check if pokemon is in final stage
                                return htmlBody.querySelectorAll('[data-menu="evocheck"]').length === 0;
                            }),

                            // Find out if the pokemon is missing in pokedex
                            switchMap(isInFinalStage => {
                                if (isInFinalStage) {
                                    // Return pokemon immediatly if in final form
                                    return of(false);
                                } else {
                                    // Check if pokemon is already in pokedex
                                    const newId = Number(pokedex.filter(entry => entry.name === pokemon.name)[0].id) + 1;
                                    const nextForms = pokedex.filter(entry => entry.id == newId.toString());

                                    if (nextForms.length === 0) {
                                        // Dont know what went wron \_(0.0)_/ (id maybe not a number)
                                        return of(true);
                                    } else {
                                        // Pokemons next form is either already in pokedex or not

                                        if (nextForms[0].pokedex) {
                                            console.log(
                                                `Pokemon ${pokemon.monsterid} (${pokemon.name}) is not in final form but next form ${nextForms[0].name} is already in pokedex.`
                                            );
                                        }

                                        return of(!nextForms[0].pokedex);
                                    }
                                }
                            }),
                            filter(isWorthKeeping => !isWorthKeeping),
                            map(_ => pokemon)
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
                log(`Released a pokemon (${released})`);
                released++;
            }
        });
}
