import { filter, map, switchMap } from 'rxjs/operators';

import { RequestMethod, sendServerRequest } from '../utils/requests';


export function buyAlbinoRadarIfPossibleAndSellIt() {
    return sendServerRequest('https://pokefarm.com/albinohunt/buy.albinoradar', RequestMethod.Post, '{"confirm":1}').pipe(
        map(body => {
            return JSON.parse(body as any).ok;
        }),
        filter(_ => !!_),
        switchMap(_ => sellAlbinoRadar())
    );
}

export function sellAlbinoRadar() {
    return sendServerRequest('https://pokefarm.com/inventory/quicksell', RequestMethod.Post, '{"id":"382","q":"1"}').pipe(
        map(body => {
            return JSON.parse(body as any).ok;
        })
    );
}
