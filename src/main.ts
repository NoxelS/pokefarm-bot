import * as dotenv from 'dotenv';

import { getUserStats } from './controllers/stats';


dotenv.config();

getUserStats().subscribe(res => {
    console.log(res);
})

// from(['1', '2', '3'])
//     .pipe(
//         tap(a => {
//             console.log(a);
//         }),
//         concatMap(pokemon => interactWithMonster('a', getBerryByTaste(BerryTaste.any)))
//     )
//     .subscribe(res => console.log(res.ok));

// getListOfOnlineUsers()
//     .pipe(
//         take(3),
//         map(user => user.url),
//         mergeMap(getPokemonsInPartyFromUser)
//     )
//     .subscribe(async pokemon => {
//         const ok = interactWithMonsterList(pokemon);
//     });
