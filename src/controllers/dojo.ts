import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';


export function collectTrainingBags(): Observable<{ ok: boolean; error: string }> {
    const dojoURL = 'https://pokefarm.com/dojo/training/collect';
    return getTrainingsMonsterIDs().pipe(
        switchMap(id => {
            return sendServerRequest<string>(dojoURL, RequestMethod.Post, `{"id":"${id}"}`).pipe(map(body => JSON.parse(body)));
        })
    );
}

export function getTrainingsMonsterIDs(): Observable<string> {
    const dojoURL = 'https://pokefarm.com/dojo/training';
    return sendServerRequestAndGetHtml(dojoURL, RequestMethod.Get).pipe(
        switchMap(html => {
            return html.querySelectorAll('[data-pid]').map(pokemon => pokemon.attributes['data-pid']);
        })
    );
}
