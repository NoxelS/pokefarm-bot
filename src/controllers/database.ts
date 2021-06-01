import { appendFileSync, createReadStream, readFileSync } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import { from, Observable } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { log } from '../shared/logger';
import { RequestMethod, sendServerRequestAndGetHtml } from '../utils/requests';
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
    const data = shuffle(readFileSync('./user-list.db', {encoding: "utf-8"}).split(/\r?\n/g));
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
    const data = readFileSync('./user-list.db', {encoding: "utf-8"}).split(/\r?\n/g);
    return getListOfOnlineUsers().pipe(
        tap(user => {
            if(!data.includes(user.url)) {
                appendFileSync('./user-list.db', user.url + '\r\n');
            }
        })
    )
}

export function saveBestHoardUsers() {
    const data = readFileSync('./user-list.db', {encoding: "utf-8"}).split(/\r?\n/g);
    const pages = [];
    // On rank 50 there are still approx. 2k pokemons per user
    for (let i = 50; i < 100; i++) {
        pages.push(i);
    }
    return from(pages).pipe(
        switchMap(page => sendServerRequestAndGetHtml(`https://pokefarm.com/stats/hoard/${page}`, RequestMethod.Get)),
        map(body => body.querySelectorAll('.userlink0').map(e => e.innerText)),
        switchMap(users => from(users)),
        tap(user => {
            if(!data.includes(user)) {
                appendFileSync ('./user-list.db', user + '\r\n');
                data.push(user);
            }
        }
    ))
}