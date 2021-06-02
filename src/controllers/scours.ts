import { from, Observable } from 'rxjs';
import { filter, map, skip, switchMap, take, tap } from 'rxjs/operators';

import { log } from '../shared/logger';
import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';
import { getAllFieldPokemonsFromUser } from './fields';


/** Retrive scour mission and send on mew mission when retrieved */
export function handleScourMissions(): Observable<{ ok: boolean; error: string }> {
    return getScourMissionPokemons().pipe(
        switchMap(pokeObject => {
            const [pokemonId, happy] = [pokeObject.pokemonid, pokeObject.happy];

            if (happy > 30) {
                // Send on same mission again
                return sendServerRequest<{ ok: boolean; error: string }>(
                    'https://pokefarm.com/scour/retrieve',
                    RequestMethod.Post,
                    `{"pid":"${pokemonId}"}`
                ).pipe(
                    switchMap(_ => startScourMission(pokemonId))
                );
            } else {
                // Find new pokemon
                const random = (max: number) => Math.round(Math.random()*max);
                log(`Pokemon ${pokemonId} has not enough energy to scour again. Trying to find a new one to replace...`);
                return getAllFieldPokemonsFromUser({ url: process.env.pfqusername as string, name: process.env.pfqusername as string }).pipe(
                    switchMap(pokemons => from(pokemons)),
                    filter(mon => !!mon && !!mon.monsterid),
                    skip(random(1000)),
                    take(1),
                    tap(mon => {
                        log(`Found new scour monster as replacement for ${pokemonId}: (${mon.monsterid})`);
                    }),
                    switchMap(pokemon =>
                        sendServerRequest<{ ok: boolean; error: string }>(
                            'https://pokefarm.com/scour/retrieve',
                            RequestMethod.Post,
                            `{"pid":"${pokemonId}"}`
                        ).pipe(switchMap(_ => startScourMission(pokemon.monsterid)))
                    )
                );
            }
        })
    );
}

/** Start new scour mission TODO: make locid dynamic based on pokemon prefrences */
export function startScourMission(pokemonId: string, locid = 1): Observable<{ ok: boolean; error: string }> {
    return sendServerRequest<{ ok: boolean; error: string }>(
        'https://pokefarm.com/scour/send',
        RequestMethod.Post,
        `{"pid":"${pokemonId}","locid":"${locid}"}`
    );
}

export function getScourMissionPokemons(): Observable<{ pokemonid: string; happy: number }> {
    return sendServerRequestAndGetHtml('https://pokefarm.com/scour', RequestMethod.Get).pipe(
        switchMap(htmlDOM => {
            const energies = htmlDOM.querySelectorAll('.happy').map(e => e.innerText.replace(/[^0-9\.]+/g, ''));
            const monsterIds = htmlDOM.querySelectorAll('[data-pid]').map(pokemon => pokemon.attributes['data-pid']);
            const data = [];
            for (let i = 0; i < monsterIds.length; i++) {
                data.push({
                    pokemonid: monsterIds[i],
                    happy: Number(energies[i])
                });
            }
            return from(data);
        })
    );
}
