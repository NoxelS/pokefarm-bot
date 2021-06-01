import exp from 'constants';
import * as dotenv from 'dotenv';
import { Agent } from 'https';
import fetch from 'node-fetch';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { BerryTypeEnum, getBerryByTaste } from '../shared/items.const';
import { log } from '../shared/logger';
import { RequestMethod, sendServerRequest } from '../utils/requests';
import { getClickBackUsernames, getPokemonsInPartyFromUser, Pokemon } from './party.interacter';


dotenv.config();

export function interactWithMonster(monsterid: string, berry: BerryTypeEnum) {
    return sendServerRequest<string>(
        'https://pokefarm.com/summary/interact',
        RequestMethod.Post,
        `{"berry":null,"pid":[{"pid":"${monsterid}","berry":"${berry}"}],"ismulticlick":true,"returnformat":"party"}`
    ).pipe(map(jsonRES => JSON.parse(jsonRES)));
}

const httpsAgent = new Agent({ keepAlive: true });

/** The body which needs to be sent along with an interaction request */
export class InteractionBody {
    // TODO: Find out what this field is for
    berry = null;

    // Stores monsterid and berry to feed
    pid: { pid: string; berry: string }[] = [];

    // TODO: Find out what this field is for
    ismulticlick = true;

    returnformat;

    constructor(pokemons: Pokemon[], party = false) {
        this.ismulticlick = !party;
        if(party) {
            this.returnformat = "party";
        }
        this.pid = pokemons.map(pokemon => ({ pid: pokemon.monsterid, berry: getBerryByTaste(pokemon.taste) }));
    }
}

export function interactWithMonsterList(list: Pokemon[], party?: boolean): Observable<{ ok: boolean; exbars: string; error: string }> {
    return sendServerRequest<{ ok: boolean; error: string }>(
        'https://pokefarm.com/summary/interact',
        RequestMethod.Post,
        JSON.stringify(new InteractionBody(list, party))
    ).pipe(
        map(res => JSON.parse(res as any)),
        tap(res => {
            log(`Interacted [${res.ok ? 'successful' : 'failed'}] with a field of ${list.length} pokemons.`);
        })
    );
}

/** Gets all users that can recive a clickback and interacts with all party members */
export function interactWithAllClickbackMonster() {
    log("Switch back");
    return getClickBackUsernames().pipe(
        switchMap(user => getPokemonsInPartyFromUser(user)),
        switchMap(pokemons => interactWithMonsterList(pokemons, true))
    );
}
