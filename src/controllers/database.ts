import exp from 'constants';
import { appendFileSync, createReadStream, readFileSync } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import { from, Observable } from 'rxjs';
import { filter, mergeMap, switchMap, tap } from 'rxjs/operators';

import { log } from '../shared/logger';
import { getAllFieldPokemonsFromUser } from './fields';
import { interactWithMonsterList } from './interact';
import { getListOfOnlineUsers, User } from './party.interacter';


const shuffle = require('array-shuffle');

const rl = createInterface({
    input: createReadStream(resolve('./', 'user-list.db'))
});

/** Only needed if the database is really big */
export function interactWithPlayerDB() {
    return new Observable(observer => {
        rl.on('line', val => observer.next(val));
        rl.on('error', err => observer.error(err));
        rl.on('close', () => observer.complete());
    }).pipe(
        mergeMap(userurl => {
            return getAllFieldPokemonsFromUser(<User>{ name: userurl, url: userurl });
        }),
        switchMap(list => interactWithMonsterList(list)),
        filter(res => !res.ok),
        tap(res => console.log(res.error))
    );
}

/** Fast for small user lsits */
export function interactWithPlayerDBArray() {
    const data = shuffle(readFileSync('./user-list.db', {encoding: "utf-8"}).split('\r\n'));
    log(`Found ${data.length} users in file.`)
    return from(data).pipe(
        mergeMap(userurl => {
            return getAllFieldPokemonsFromUser(<User>{ name: userurl, url: userurl });
        }),
        switchMap(list => interactWithMonsterList(list)),
        filter(res => !res.ok),
        tap(res => console.log(res.error))
    );
}

/** Saves current online users in database */
export function saveCurrentOnlineUsers() {
    const data = readFileSync('./user-list.db', {encoding: "utf-8"}).split('\r\n');
    return getListOfOnlineUsers().pipe(
        tap(user => {
            if(!data.includes(user.url)) {
                appendFileSync('./user-list.db', user.url + '\r\n');
            }
        })
    )
}
