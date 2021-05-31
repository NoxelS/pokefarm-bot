

import { interactWithPlayerDB } from './controllers/database';


// const interact = getListOfOnlineUsers().pipe(
//     skip(150),
//     mergeMap(user => {
//         return getAllFieldPokemonsFromUser(user);
//     }),
//     switchMap(list => interactWithMonsterList(list)),
//     tap(_ => console.log('interact'))
// ).subscribe()

interactWithPlayerDB().subscribe();

// getListOfOnlineUsers().pipe(
//     tap(user => {
//         appendFileSync('./user-list.db', user.url+ '\r\n', {encoding: 'utf-8'})
//     }),
// ).subscribe()