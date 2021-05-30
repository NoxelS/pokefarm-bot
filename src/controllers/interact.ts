import {map} from 'rxjs/operators';

import {BerryTypeEnum} from '../shared/items.const';
import {RequestMethod, sendServerRequest} from '../utils/requests';


export function interactWithMonster(monsterid: string, berry: BerryTypeEnum) {
    return sendServerRequest<string>(
        'https://pokefarm.com/summary/interact',
        RequestMethod.Post,
        `{"berry":null,"pid":[{"pid":"${monsterid}","berry":"${berry}"}],"ismulticlick":true,"returnformat":"party"}`
    ).pipe(
        map(jsonRES => (JSON.parse(jsonRES) as { ok: boolean; error: string }).ok),
    );
}

export interface Pokemon {
    pid: string;
    berry: string;
    check: boolean; // probably always 'false'
}

export function interactWithMonsterArray(monsterArray: Array<Pokemon>, berry: BerryTypeEnum) {
    return sendServerRequest<string>(
        'https://pokefarm.com/summary/interact',
        RequestMethod.Post,
        `{"berry":null,"pid":${monsterArray},"berry":"${berry}"}],"ismulticlick":true,"returnformat":"party"}`
    ).pipe(
        map(jsonRES => (JSON.parse(jsonRES) as { ok: boolean; error: string }).ok),
    );
}