import { from } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { RequestMethod, sendServerRequestAndGetHtml } from '../utils/requests';


export function interactWith10Parties() {
    return getListOfOnlineUsers().pipe(
        map(users => {
            console.log(users);
        })
    );
}

// TODO: Expand
export interface User {
    url: string;
    name: string;
}

export function getListOfOnlineUsers() {
    return sendServerRequestAndGetHtml('https://pokefarm.com/online', RequestMethod.Get).pipe(
        map(HTMLEle => {
            return JSON.parse(
                HTMLEle.querySelector('#onlinedata').childNodes[0].rawText.replace(
                    '" data-newicon="&lt;img src=&quot;https://pfq-static.com/img/zophan/bulb-12.png/t=1468582453&quot; title=&quot;New Farmer&quot;/>">',
                    ''
                )
            );
        }),
        switchMap((users: User[]) => from(users)),
        filter(user => !!user.url)
    );
}

export function getPokemonsInPartyFromUser(userurl: string) {
    // TODO: DATAPID nimmt andere felder
    return sendServerRequestAndGetHtml(`https://pokefarm.com/user/${userurl}`, RequestMethod.Get).pipe(
        map(HTML => {
            console.log(userurl + " - " + HTML.querySelectorAll('[data-pid]').map(egg => egg.attributes['data-pid']));
            return HTML.querySelectorAll('[data-pid]').map(egg => egg.attributes['data-pid']);
        }),
        switchMap(mons => from(mons))
    );
}

export function getClickBackUsernames() {
    return sendServerRequestAndGetHtml('https://pokefarm.com/user/~clickback', RequestMethod.Get).pipe(
        map(HTML => {
            return HTML.querySelectorAll('[data-name]').map(element => element.firstChild.innerText);
        }),
        switchMap(users => from(users).pipe(filter(username => username.split('')[0] !== ' ')))
    );
}
