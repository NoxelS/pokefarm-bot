import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';
import { log } from "../shared/logger";


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

// TODO Pokemon could always be the same, username should be opposite of env.pfqusername
// TODO maybe requires to "dismiss" battle log
export function challengeTrainer(pokemon: string, username: string) {
    const challengeURL = "https://pokefarm.com/dojo/sparring/challenge";
    return sendServerRequest(challengeURL, RequestMethod.Post, `{"message":"","pokemon":"${pokemon}","username":"${username}"}`).pipe(
        map(res => JSON.parse(res as any)),
        tap(res => {
            log(`Challenged [${res.ok ? 'successful' : 'failed'}] user [${username}] using pokemon ${pokemon}.`);
        })
    );
}

// TODO: Probably a list of incoming challenges. Accept all of them...
// TODO maybe requires to "dismiss" battle log
export function acceptChallenge() {
    const challengeURL = "https://pokefarm.com/dojo/sparring/INCOMING?";
    return sendServerRequest(challengeURL, RequestMethod.Post, ``).pipe(
        map(res => JSON.parse(res as any)),
        tap(res => {
            log(`Challenged `);
        })
    );
}
