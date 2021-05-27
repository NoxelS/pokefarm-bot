import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestMethod, sendServerRequest } from '../utils/requests';


export function skipInteractionWarning(): Observable<{ ok: boolean; error: string }> {
    const dojoURL = 'https://pokefarm.com/summary/interact-warning';
    return sendServerRequest<string>(dojoURL, RequestMethod.Post, 'null').pipe(map(body => JSON.parse(body)));
}
