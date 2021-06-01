import { from } from 'rxjs';
import { concatMap, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

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

function adoptEgg(newEggBody: any) {
    return sendServerRequest('https://pokefarm.com/lab/adopt', RequestMethod.Post, newEggBody);
}

function moveHatchedPokemon(eggID: string, fieldID: string) {
    return sendServerRequest('https://pokefarm.com/fields/movetofield', RequestMethod.Post, `{"id":"${eggID}", "field":${fieldID}, "getEmptySlot":true}`);
}

function hatchEgg(eggID: string) {
    return sendServerRequest('https://pokefarm.com/summary/hatch', RequestMethod.Post, `{"id":"${eggID}"}`);
}

function getNewEgg() {
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

function adoptNewEgg() {
    return getNewEgg().pipe(switchMap(adoptEgg));
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
                                    const nextTempFields = fields.filter(field => field.name == 'Temp' && Number(field.count) < 40);
                                    return nextTempFields.length > 0 ? nextTempFields[0].id : fields.filter(field => Number(field.count) < 40)[0].id;
                                } else {
                                    log('No field with name "Temp" was found.');
                                    return 'null';
                                }
                            }),
                            switchMap(fieldId => {
                                return moveHatchedPokemon(eggId, fieldId).pipe(switchMap(adoptNewEgg));
                            })
                        );
                    })
                );
            }
        })
    );
}
