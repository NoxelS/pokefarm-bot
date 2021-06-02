import { filter, map, switchMap } from 'rxjs/operators';

import { RequestMethod, sendServerRequest } from '../utils/requests';
import { from } from "rxjs";


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

export function sellTrainingBags(quantity: number = 2000) {
    const firstBagID = 315;
    const numberOfBags = 18;
    const itemIDs = Array.from(new Array(numberOfBags), (x, i) => i + firstBagID);

    return from(itemIDs).pipe(
        switchMap(item => {
            return sendServerRequest('https://pokefarm.com/inventory/quicksell', RequestMethod.Post, `{"id":"${item}","q":"${quantity}"}`).pipe(
                map(body => {
                    return JSON.parse(body as any).ok;
                })
            );
        })
    )
}
