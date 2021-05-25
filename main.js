const fetch = require('node-fetch');
const parse = require('node-html-parser');
const Bluebird = require('bluebird');
 
fetch.Promise = Bluebird;

const GLOBALCOOKIE = "64ee244e01f257ec141ed90a91219a3b";

async function main() {
    fetch('https://pokefarm.com/online', {
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Upgrade-Insecure-Requests': '1',
            'Sec-GPC': '1',
            cookie: `PFQSID=${GLOBALCOOKIE}`
        },
        referrer:
            'https://pokefarm.com/users/Emmafairyfeet,MissLitago,Sleepytally,ningi,KaiCat,SpaceHusk0,cathyn2361,backfire,Ice_Astral,AntTaylor216?src=~online',
        method: 'GET',
        mode: 'cors'
    })
        .then(res => res.text())
        .then(async function (body) {
            const data = parse.parse(body).querySelector('#onlinedata').childNodes[0].rawText;
            const users = JSON.parse(
                data.replace(
                    '" data-newicon="&lt;img src=&quot;https://pfq-static.com/img/zophan/bulb-12.png/t=1468582453&quot; title=&quot;New Farmer&quot;/>">',
                    ''
                )
            );
            const user = users[Math.round(Math.random() * (users.length - 1))];
            user.name = user.name.replace('{NEW}', '');
            user.name = user.name.replace('{HM}', '');
            console.log(user);
            await getListOfFields(user.url);
        });
}

async function getListOfFields(username) {
    fetch('https://pokefarm.com/fields/fieldlist', {
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Content-Type': 'application/json',
            'X-Requested-With': 'Love',
            'Sec-GPC': '1',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            cookie: `PFQSID=${GLOBALCOOKIE}`
        },
        referrer: 'https://pokefarm.com/fields/Niet',
        body: `{"uid":"${username}"}`,
        method: 'POST',
        mode: 'cors'
    })
        .then(res => res.text())
        .then(body => {
            const data = JSON.parse(body).fields;
            const interval = setInterval(() => {
                if (data.length > 0) {
                    const field = data[0];
                    getPokemonsAndBerryFromField(username, field.id);
                    data.shift();
                } else {
                    interval.unref();
                }
            }, 2500);
        });
}

async function getMonstersFromUser(username) {
    fetch('https://pokefarm.com/user/' + username, {
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Upgrade-Insecure-Requests': '1',
            'Sec-GPC': '1',
            cookie: `PFQSID=${GLOBALCOOKIE}`
        },
        method: 'GET',
        mode: 'cors'
    })
        .then(res => res.text())
        .then(body => {
            const data = parse.parse(body);
            try {
                data.querySelector('#partybox').childNodes[1].childNodes.forEach(monsterHTML => {
                    try {
                        const monsterID = monsterHTML.rawAttrs.replace('data-pid="', '').replace('"', '');
                        // await interactWithEgg(monsterID, username);
                    } catch (error) {}
                });
            } catch (error) {}
        });
}

async function getPokemonsAndBerryFromField(username, id) {
    fetch('https://pokefarm.com/fields/field', {
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Content-Type': 'application/json',
            'X-Requested-With': 'Love',
            'Sec-GPC': '1',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache'
        },
        referrer: 'https://pokefarm.com/fields/Niet',
        body: `{"id":${id},"uid":"${username}","mode":"public"}`,
        method: 'POST',
        mode: 'cors'
    })
        .then(res => res.text())
        .then(async function (body) {
            const data = parse.parse(JSON.parse(body).html).querySelectorAll('.fieldmon');
            const interval = setInterval(() => {
                if (data.length > 0) {
                    const mon = data[0];
                    const tasteBerry = new Map();
                    tasteBerry.set('any', 'aspear');
                    tasteBerry.set('sour', 'aspear');
                    tasteBerry.set('spicy', 'cheri');
                    tasteBerry.set('dry', 'chesto');
                    tasteBerry.set('sweet', 'pecha');
                    tasteBerry.set('bitter', 'rawst');
                    if (Number(mon._rawAttrs['data-fed']) === 0) {
                        interactWithMonster(mon._rawAttrs['data-id'], tasteBerry.get(mon._rawAttrs['data-flavour'].split('-')[0]), username);
                    }
                    data.shift();
                } else {
                    interval.unref();
                }
            }, 50);
        });
}

var interactions = 0;

async function interactWithMonster(monsterID, berry, username) {
    fetch('https://pokefarm.com/summary/interact', {
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Content-Type': 'application/json',
            'X-Requested-With': 'Love',
            'Sec-GPC': '1',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            cookie: `PFQSID=${GLOBALCOOKIE}`
        },
        referrer: `https://pokefarm.com/user/${username}`,
        body: `{"berry":null,"pid":[{"pid":"${monsterID}","berry":"${berry}"}],"ismulticlick":true,"returnformat":"party"}`,
        method: 'POST',
        mode: 'cors'
    })
        .then(res => res.text())
        .then(body => {
            if (JSON.parse(body).ok) {
                interactions++;
                console.log('Successful [' +interactions + '] Fed pokemon (' + monsterID + ') from ' + username);
            } else {
                console.log('Failed');
                console.log(body); 
            }
        });
}

setImmediate(() => {
    main();
}, 60 * 5 * 1000)
