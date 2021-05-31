import exp from 'constants';
import * as dotenv from 'dotenv';
import { Agent } from 'https';
import fetch from 'node-fetch';
import { concatMap, map, scan, switchMap, tap } from 'rxjs/operators';

import { BerryTypeEnum, getBerryByTaste } from '../shared/items.const';
import { RequestMethod, sendServerRequest } from '../utils/requests';
import { getClickBackUsernames, getPokemonsInPartyFromUser, Pokemon } from './party.interacter';


dotenv.config();

export function interactWithMonster(monsterid: string, berry: BerryTypeEnum) {
    console.log('Feeding mon');
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

    // TODO: Find out what this field is for
    returnformat = 'party';

    constructor(pokemons: Pokemon[]) {
        this.pid = pokemons.map(pokemon => ({ pid: pokemon.monsterid, berry: getBerryByTaste(pokemon.taste) }));
    }
}

export async function interactWithMonsterAsync(monsterid: string, berry: BerryTypeEnum) {
    console.log(process.env.PFQSID);
    const res = await fetch('https://pokefarm.com/summary/interact', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Content-Type': 'application/json',
            'X-Requested-With': 'Love',
            'Sec-GPC': '1',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            cookie: `PFQSID=${process.env.PFQSID}`
        },
        body: `{"berry":null,"pid":[{"pid":"${monsterid}","berry":"${berry}"}],"ismulticlick":true,"returnformat":"party"}`,
        method: 'POST',
        agent: httpsAgent
    }).catch(err => {
        // console.log(err);
    });

    if (!!res) {
        const body = await res.text();
        return JSON.parse(body).ok;
    }
    return !!(res as any);
}

export function interactWithMonsterList(list: Pokemon[]) {
    return sendServerRequest<{ ok: boolean; error: string }>(
        'https://pokefarm.com/summary/interact',
        RequestMethod.Post,
        JSON.stringify(new InteractionBody(list))
    );
}

/** Gets all users that can recive a clickback and interacts with all party members */
export function interactWithAllClickbackMonster() {
    return getClickBackUsernames().pipe(
        concatMap(getPokemonsInPartyFromUser),
        scan((acc, value) => [...acc, ...value]),
        switchMap(interactWithMonsterList),
        tap(console.log)
    )
}
