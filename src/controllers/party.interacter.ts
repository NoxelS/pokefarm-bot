import parse from 'node-html-parser';
import { from, Observable } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { BerryTaste } from '../shared/items.const';
import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';


// TODO: Expand
export interface User {
    url: string;
    name: string;
}

export interface Pokemon {
    monsterid: string;
    isEgg: boolean;
    taste: BerryTaste;
    name: string;
}

export interface PokemonWithField extends Pokemon {
    fieldid: string;
    isFinalForm: boolean;
    isTooYoungToBeReleased: boolean;
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
        mergeMap((users: User[]) => from(users)),
        filter(user => !!user.url)
    );
}

export function getPokemonsInPartyFromUser(userurl: string): Observable<Pokemon[]> {
    return sendServerRequest<any>(`https://pokefarm.com/users/load`, RequestMethod.Post, `{\"name\":\"${userurl}\"}`).pipe(
        map(body => parse(JSON.parse(body).html)),
        map(r => {
            return r.querySelectorAll('[data-pid]').map(monster => {
                return <Pokemon>{
                    monsterid: monster.attributes['data-pid'],
                    isEgg: monster.querySelector('.summarylink')?.innerText.indexOf('&lt;Egg>') !== -1,
                    taste: monster.querySelector('[data-up]')?.attributes['data-up'] || BerryTaste.any,
                    name: monster.querySelector('.summarylink')?.innerText.replace('&lt;Egg>', 'Egg')
                };
            });
        })
    );
}

export function getClickBackUsernames() {
    return sendServerRequestAndGetHtml('https://pokefarm.com/user/~clickback', RequestMethod.Get).pipe(
        map(HTML => {
            return HTML.querySelectorAll('[data-name]').map(element => element.firstChild?.innerText);
        }),
        switchMap(users => from(users).pipe(filter(username => username.split('')[0] !== ' ')))
    );
}
