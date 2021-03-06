import { EMPTY } from 'rxjs';
import { catchError, filter, map, retry, switchMap, tap } from 'rxjs/operators';

import { log } from '../shared/logger';
import { RequestMethod, sendServerRequestAndGetHtml } from '../utils/requests';
import { getAllFieldPokemonsFromUser } from './fields';
import { interactWithMonsterList } from './interact';


var lastPokerusUser: string;

export function ddosPokerusUser() {
    return getPokerusUser().pipe(
        filter(user => user !== lastPokerusUser),
        tap(user => {
            lastPokerusUser = user;
            log(`Ddosing new pokerus host ${user}`);
        }),
        switchMap(userurl => {
            return getAllFieldPokemonsFromUser({ url: userurl, name: userurl })
                .pipe(
                    switchMap(mons => {
                        return interactWithMonsterList(mons).pipe(
                            tap(res => {
                                if (!res.ok) throw res;
                            }),
                            retry(3) // Because this is the only fast interaction in utlity, the requests will fail a lot
                        );
                    })
                )
                .pipe(
                    catchError(err => {
                        log('Failed to interact with pokerus host. Retrying...');
                        return EMPTY;
                    })
                );
        })
    );
}

export function getPokerusUser() {
    return sendServerRequestAndGetHtml('https://pokefarm.com/pkrs', RequestMethod.Get).pipe(
        map(body => {
            // TODO: find save way to get the name
            return body.querySelector('#pkrsinfo').childNodes[1].childNodes[0].childNodes[0].childNodes[0].rawText;
        })
    );
}
