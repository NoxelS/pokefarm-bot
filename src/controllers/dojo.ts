import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';


export function collectTrainingBags(): Observable<{ ok: boolean; error: string }> {
    const dojoURL = 'https://pokefarm.com/dojo/training/collect';
    return getTrainingsMonsterID().pipe(
        switchMap(id => {
            return sendServerRequest<string>(dojoURL, RequestMethod.Post, `{"id":"${id}"}`).pipe(map(body => JSON.parse(body)));
        })
    );
}

export function getTrainingsMonsterID(): Observable<string> {
    const dojoURL = 'https://pokefarm.com/dojo/training';
    return sendServerRequestAndGetHtml(dojoURL, RequestMethod.Get).pipe(
        map(html => {
            return html.querySelectorAll('[data-pid]')[0].attributes['data-pid'];
        })
    );
}
