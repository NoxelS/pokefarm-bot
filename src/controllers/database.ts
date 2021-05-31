import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import { Observable } from 'rxjs';
import { filter, mergeMap, switchMap, tap } from 'rxjs/operators';

import { getAllFieldPokemonsFromUser } from './fields';
import { interactWithMonsterList } from './interact';
import { User } from './party.interacter';


const rl = createInterface({
    input: createReadStream(resolve('./', 'user-list.db'))
});

export function interactWithPlayerDB() {
    return new Observable(observer => {
        rl.on('line', val => observer.next(val));
        rl.on('error', err => observer.error(err));
        rl.on('close', () => observer.complete());
    }).pipe(
        mergeMap(userurl => {
            return getAllFieldPokemonsFromUser(<User>{name: userurl, url: userurl});
        }),
        switchMap(list => interactWithMonsterList(list)),
        filter(res => !res.ok),
        tap(res => console.log(res.error))
    );
}