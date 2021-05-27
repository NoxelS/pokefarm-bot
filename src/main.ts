import { count, map, mergeMap, take } from 'rxjs/operators';

import { getListOfOnlineUsers, getPokemonsInPartyFromUser } from './controllers/party.interacter';


getListOfOnlineUsers()
    .pipe(
        map(user => user.url),
        take(10),
        mergeMap(getPokemonsInPartyFromUser),
        // mergeMap(monsterid => interactWithMonster(monsterid, BerryTypeEnum.aspear)),
        count()
    )
    .subscribe(console.log, _ => console.log(_));