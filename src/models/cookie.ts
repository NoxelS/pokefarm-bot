import { parse } from 'cookie';
import { config } from 'dotenv';
import moment from 'moment';
import { Observable } from 'rxjs';

import { log } from '../shared/logger';
import { RequestMethod } from '../utils/requests';


const fetch = require('sync-fetch');

config();
export interface PokefarmCookie {
    PFQSID: string;
    expires: string;
    path: string;
    domain: string;
}

export const COOKIE_EXPIRES_FORMAT = 'ddd, DD-MMM-YYYY HH:mm:ss Z';

/** Shadow datatype for the PFQSID */
export type PFQSID = string;

/**
 * If no valid cookie is found a new cookie will be fetched.
 * Cookie ist stores in process.env.PFQSID and process.env.COOKIE_EXPIRES
 * @returns Observable<PFQSID>
 */
export function getCookie(): Observable<PFQSID> {
    const [PFQSID, expires] = [process.env.PFQSID, process.env.COOKIE_EXPIRES];
    return new Observable(observer => {
        if (PFQSID && expires && moment(expires, COOKIE_EXPIRES_FORMAT).isAfter()) {
            // Load cookie if not expired
            observer.next(PFQSID);
        } else {
            // Get new cookie if expired
            login().subscribe(cookie => {
                const [PFQSID, expires] = [cookie.PFQSID, cookie.expires];

                // Set as env for easy access
                process.env.PFQSID = PFQSID;
                process.env.COOKIE_EXPIRES = expires;

                observer.next(PFQSID);
            });
        }
    });
}
/**
 * Login with process.env.username and process.env.password and get the authentication cookie.
 * @returns Observable<PokefarmCookie>
 */
export function login(): Observable<PokefarmCookie> {
    const [username, password] = [process.env.pfqusername, process.env.pfqpassword];
    if (!(username && password)) {
        throw new Error('Username and Password is missing.');
    }
    log(`Logging in with ${username} - ${password}`);
    return new Observable(observer => {
        const res = fetch('https://pokefarm.com/index/login', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
                'X-Requested-With': 'Love',
                'Content-Type': 'application/json',
                'Upgrade-Insecure-Requests': '1',
                'Sec-GPC': '1'
            },
            method: RequestMethod.Post,
            // TODO: allow twofa
            body: `{"username":"${username}","password":"${password}","twofa":""}`
        });

        if (!!res) {
            const cookie = parse(res.headers.get('set-cookie') || '');
            if (cookie && cookie.PFQSID && cookie.expires) {
                observer.next(cookie as unknown as PokefarmCookie);
            }
        } else {
            observer.error('There was an error while logging in');
        }
        observer.complete();
    });
}
