import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';


/** Retrive scour mission and send on mew mission when retrieved */
export function handleScourMissions(): Observable<{ ok: boolean; error: string }> {
    return getScourMissionPokemonIds().pipe(
        switchMap(pokemonIds => from(pokemonIds)),
        switchMap(pokemonId => {
            return sendServerRequest<{ ok: boolean; error: string }>('https://pokefarm.com/scour/retrieve', RequestMethod.Post, `{"pid":"${pokemonId}"}`).pipe(
                // filter(res => res.ok),
                switchMap(_ => startScourMission(pokemonId))
            );
        })
    );
}

/** Start new scour mission TODO: make locid dynamic based on pokemon prefrences */
export function startScourMission(pokemonId: string, locid = 1): Observable<{ ok: boolean; error: string }> {
    return sendServerRequest<{ ok: boolean; error: string }>('https://pokefarm.com/scour/send', RequestMethod.Post, `{"pid":"${pokemonId}","locid":"${locid}"}`);
}

export function getScourMissionPokemonIds(): Observable<string[]> {
    return sendServerRequestAndGetHtml('https://pokefarm.com/scour', RequestMethod.Get).pipe(
        map(htmlDOM => {
            return htmlDOM.querySelectorAll('[data-pid]').map(pokemon => pokemon.attributes['data-pid']);
        })
    );
}
