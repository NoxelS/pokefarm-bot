import { EMPTY, from, iif, Observable } from 'rxjs';
import { catchError, concatMap, filter, first, map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';

import { log } from '../shared/logger';
import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';
import { getFields } from './fields';


/** TODO: only filters out text! Needs some mapping to understand what types of requirements are possible */
export function checkEvoRequirements(monsterid: string) {
    return sendServerRequestAndGetHtml('https://pokefarm.com/summary/evocheck', RequestMethod.Post, true, `{\"id\":\"${monsterid}\"}`).pipe(
        map(body => {
            console.log(
                body
                    .querySelectorAll('p')
                    .map(p => p.innerText)
                    .filter(text => text.indexOf(': ') !== -1)
                    .map(r => r.split(': ')[1])
            );
        })
    );
}

export function evolvePokemon(pokemonid: string, intoid: string) {
    return sendServerRequest(
        'https://pokefarm.com/summary/evolve',
        RequestMethod.Post,
        `{"id":"${pokemonid}","expect":"${intoid}","returnmode":"simple","confirmed":true}`
    );
}

export function evolveAllPokemons() {
    const nextPages: (number | null)[] = [null];
    for (let i = 0; i < 40; i++) {
        nextPages.push(i * 100);
    }

    return from(nextPages).pipe(
        switchMap(nextpage =>
            sendServerRequest('https://pokefarm.com/farm/evolutions', RequestMethod.Post, `{\"start\":${nextpage}}`).pipe(
                filter(res => JSON.parse(res as any).ok && JSON.parse(res as any).evolutions?.length > 0),
                map(res => JSON.parse(res as any).evolutions) // TODO: make type
            )
        ),
        switchMap(evos => from(evos)),
        tap(evo => {
            console.log((evo as any).id, (evo as any).formeid);
        }),
        switchMap(evo => evolvePokemon((evo as any).id, (evo as any).formeid)),
        filter(res => JSON.parse(res as any).ok)
    );
}

function adoptEggFromLab(newEggBody: string) {
    return sendServerRequest('https://pokefarm.com/lab/adopt', RequestMethod.Post, newEggBody);
}

function adoptEggFromShelter(newEggBody: string) {
    return sendServerRequest('https://pokefarm.com/shelter/adopt', RequestMethod.Post, newEggBody);
}

export function moveHatchedPokemon(eggID: string, fieldID: string) {
    return sendServerRequest('https://pokefarm.com/fields/movetofield', RequestMethod.Post, `{"id":"${eggID}", "field":${fieldID}, "getEmptySlot":true}`);
}

function hatchEgg(eggID: string) {
    return sendServerRequest('https://pokefarm.com/summary/hatch', RequestMethod.Post, `{"id":"${eggID}"}`);
}

function getNewEggFromLab() {
    return sendServerRequest<string>('https://pokefarm.com/lab/eggs', RequestMethod.Post, '{}').pipe(
        map(body => {
            const eggData = JSON.parse(body);
            const eggs = eggData.eggs;
            const timestamp = eggData.targettime;
            let newEgg = `{"egg": ${3}, "key": ${timestamp}}`; //Default

            eggs.forEach((egg: any, index: number) => {
                if (egg.name === '???????') {
                    newEgg = `{"egg": ${index}, "key": ${timestamp}}`;
                }
            });
            return newEgg;
        })
    );
}

export function adoptNewEgg() {
    return getAdoptionsLeft().pipe(
        switchMap(adoptionsLeft =>
            iif(() => (adoptionsLeft > 0),
                getNewEggFromShelter().pipe(switchMap(adoptEggFromShelter),
                    switchMap(res => {
                        const result = JSON.parse(res as any);
                        if (!result.ok) {
                            log(`Adopting egg from Shelter failed. Reason: [${result.error}] Getting egg from Lab...`)
                            return getNewEggFromLab().pipe(switchMap(adoptEggFromLab))
                        } else {
                            return EMPTY
                        }
                    }),),
                getNewEggFromLab().pipe(switchMap(adoptEggFromLab))
            )
        )
    )
}

export enum Flute {
    'first' = 'first',
    'white' = 'white',
    'black' = 'black'
}

export interface ShelterPokemon {
    id: string;
    stage: string;
    sprite: string;
    name: string;
}

export function getNewEggFromShelter(): Observable<string> {
    const reload_shelter_times = 3;
    return loadShelter(Flute.black).pipe(
        take(30),
        toArray(),
        map(shelter => {
            if (shelter.find(egg => egg.name === "Egg")) {
                return shelter;
            } else {
                log(`No new egg found in Shelter! Attempting again...`);
                throw new Error("No new egg found");
            }
        }),
        //retryWhen(errors => errors.pipe(delay(1000), take(reload_shelter_times))),
        tap(egg => log(`New egg found in Shelter! Attempting to adopt...`)),
        switchMap(monArr => from(monArr)),
        filter(egg => egg.name === "Egg"),
        first(),
        map(egg => {
            return `{"id": "${egg.id}"}`
        }),
    ).pipe(
        catchError(err => {
            log(`No new egg found after reloading Shelter ${reload_shelter_times} times. Getting random egg from shelter...`);
            return getRandomEggFromShelter();
        }),
    );
}

export function getRandomEggFromShelter(): Observable<string> {
    return loadShelter(Flute.black).pipe(
        first(),
        tap(egg => log(`Adopting random egg from Shelter: ${egg.name}`)),
        map(egg => {
            return `{"id": "${egg.id}"}`
        }),
    )
}

export function loadShelter(flute?: Flute): Observable<ShelterPokemon> {
    const loadURL = "https://pokefarm.com/shelter/load";
    const postBody = flute == undefined ? '' : `{"flute": "${flute}"}`;
    return sendServerRequest(loadURL, RequestMethod.Post, postBody).pipe(
        map(res => JSON.parse(res as any)),
        tap(res => {
            if (!res.ok) log("Can't load shelter: " + res.error);
        }),
        filter(res => res.ok),
        switchMap(res => res.pokemon as Observable<ShelterPokemon>)
    );
}

export function getAdoptionsLeft(): Observable<number> {
    const loadURL = "https://pokefarm.com/shelter/load";
    const postBody = `{}`;
    return sendServerRequestAndGetHtml(loadURL, RequestMethod.Post, true, postBody).pipe(
        map(html => {
            const p = html.querySelectorAll('p');
            const text = p[p.length - 1].innerText;
            const adoptionsLeft = parseInt(text.substring(20,
                text.lastIndexOf(" adoptions"))
            );
            log(`Adoptions from shelter left: ${adoptionsLeft}`);
            return adoptionsLeft;
        })
    );
}

/** TODO: refactor */
export function hatchPartyEggs() {
    return sendServerRequestAndGetHtml('https://pokefarm.com/party', RequestMethod.Get).pipe(
        map(htmlDOM => {
            const partyMembers = htmlDOM.querySelector('.party').childNodes;
            return partyMembers.map(member => {
                return (member as any).rawAttrs.substring((member as any).rawAttrs.indexOf('"') + 1, (member as any).rawAttrs.lastIndexOf('"'));
            });
        }),
        concatMap(eggIds => from(eggIds)),
        mergeMap(eggId => {
            if (eggId.length === 0) {
                // Slot is empty for whatever reason
                log('Found empty spot in party. Trying to adopt a new egg.');
                return adoptNewEgg();
            } else {
                return hatchEgg(eggId).pipe(
                    filter(res => JSON.parse(res as any).ok),
                    tap(() => {
                        log('Found a finished egg. Adoptiong new egg.');
                    }),
                    switchMap(() => {
                        return getFields(process.env.pfqusername as any).pipe(
                            map(fields => {
                                if (!!fields) {
                                    let positionToMoveTo = fields.findIndex(field => field.name == 'Temp' && Number(field.count) < 40);
                                    if (positionToMoveTo == -1) positionToMoveTo = fields.findIndex(field => Number(field.count) < 40);
                                    return positionToMoveTo;
                                } else {
                                    log('No field with name "Temp" was found.');
                                    return 'null';
                                }
                            }),
                            switchMap(fieldId => {
                                return moveHatchedPokemon(eggId, fieldId.toString()).pipe(switchMap(adoptNewEgg));
                            })
                        );
                    })
                );
            }
        })
    );
}
