import { from, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { RequestMethod, sendServerRequest, sendServerRequestAndGetHtml } from '../utils/requests';
import { PokemonWithField, User } from './party.interacter';


export interface Field {
    id: string;
    name: string;
    type: string;
    icon: string;
    lock: string;
    count: string;
}

export function getFields(username: string): Observable<Field[]> {
    return sendServerRequest('https://pokefarm.com/fields/fieldlist', RequestMethod.Post, `{\"uid\":\"${username}\"}`).pipe(
        map(res => {
            return JSON.parse(res as any).fields;
        })
    );
}

export function getAllFieldPokemonsFromUser(user: User): Observable<PokemonWithField[]> {
    return getFields(user.url).pipe(
        switchMap(fields => from(fields)),
        switchMap(field =>
            sendServerRequestAndGetHtml(
                'https://pokefarm.com/fields/field',
                RequestMethod.Post,
                true,
                `{"id":${field.id},"uid":"${user.url}","mode":"public"}`
            ).pipe(
                map(body => {
                    const data = body.querySelectorAll('.fieldmon');
                    return data.map(mon => {
                        return <PokemonWithField>{
                            monsterid: mon.attributes['data-id'],
                            isEgg: false,
                            taste: mon.attributes['data-flavour'].split('-')[0],
                            name: '',
                            fieldid: field.id
                        };
                    });
                }),
                filter(mons => !!mons.length)
            )
        )
    );
}
