import fetch from 'node-fetch';
import parse, { HTMLElement } from 'node-html-parser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { USERCOOKIE } from '../const';


/** Add new ones if needed */
export enum RequestMethod {
    Get = 'GET',
    Post = 'POST'
}

export function sendServerRequest<T>(url: string, method: RequestMethod, postbody?: string): Observable<T> {
    return new Observable(observer => {
        fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
                'X-Requested-With': 'Love',
                'Content-Type': 'application/json',
                'Upgrade-Insecure-Requests': '1',
                'Sec-GPC': '1',
                cookie: `PFQSID=${USERCOOKIE}`
            },
            method: method as any,
            body: postbody
        })
            .catch(err => {
                observer.error(err);
            })
            .then(res => {
                if (!!res) {
                    return (res as any).text();
                } else {
                    observer.error(res);
                }
            })
            .then(body => {
                observer.next(body);
            })
            .finally(() => {
                observer.complete();
            });
    });
}

/** Get a HTMLElement from the response (if inFieldHTML is set to true, the html field will be read) */
export function sendServerRequestAndGetHtml(url: string, method: RequestMethod, inFieldHTML?: boolean): Observable<HTMLElement> {
    if (!!inFieldHTML) {
        return sendServerRequest<string>(url, method).pipe(map(body => parse(JSON.parse(body).html)));
    } else {
        return sendServerRequest<string>(url, method).pipe(map(body => parse(body)));
    }
}
