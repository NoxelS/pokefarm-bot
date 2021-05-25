const fetch = require('node-fetch');
const parse = require('node-html-parser');
const AbortController = require('node-abort-controller');


async function fetchWithTimeout(resource, options) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 150);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

const GLOBALCOOKIE = '64ee244e01f257ec141ed90a91219a3b';

var fails = 0;
var success = 0;

async function getListOfOnlineUsers() {
    const res = await fetch('https://pokefarm.com/online', {
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
    }).catch(function () {
        fails++;
    });

    if (!!res) {
        const body = await res.text();
        const data = await parse.parse(body).querySelector('#onlinedata').childNodes[0].rawText;
        console.log("Got list of Users");
        return JSON.parse(
            data.replace(
                '" data-newicon="&lt;img src=&quot;https://pfq-static.com/img/zophan/bulb-12.png/t=1468582453&quot; title=&quot;New Farmer&quot;/>">',
                ''
            )
        );
    } else {
        return [];
    }
}

async function getListOfFields(userUrl) {
    const res = await fetch('https://pokefarm.com/fields/fieldlist', {
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
        body: `{"uid":"${userUrl}"}`,
        method: 'POST',
        mode: 'cors'
    }).catch(function () {
        fails++;
    });
    if (!!res) {
        const body = await res.text();
        const data = JSON.parse(body).fields;
        console.log(data[0]);

        let monCount = 0;
        data.forEach(f => monCount += f.count);


        console.log("Got list of Fields from " + userUrl + " with " + monCount + "pokemons");
        return [data, monCount];
    } else {
        return [];
    }
}

async function getPokemonsAndBerryFromField(username, field) {
    const res = await fetch('https://pokefarm.com/fields/field', {
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
        body: `{"id":${field.id},"uid":"${username}","mode":"public"}`,
        method: 'POST',
        mode: 'cors'
    }).catch(function () {
        fails++;
    });

    if (!!res) {
        const body = await res.text();
        const data = parse.parse(JSON.parse(body).html).querySelectorAll('.fieldmon');

        const tasteBerry = new Map();
        tasteBerry.set('any', 'aspear');
        tasteBerry.set('sour', 'aspear');
        tasteBerry.set('spicy', 'cheri');
        tasteBerry.set('dry', 'chesto');
        tasteBerry.set('sweet', 'pecha');
        tasteBerry.set('bitter', 'rawst');

        console.log("Got list of Pokemons from " + username + " in field " + field.id);

        return data.map(mon => {
            return {
                id: mon._rawAttrs['data-id'],
                berry: tasteBerry.get(mon._rawAttrs['data-flavour'].split('-')[0])
            };
        });
    } else {
        return [];
    }
}

async function interactWithMonster(monsterID, berry, username) {
    const res = await fetchWithTimeout('https://pokefarm.com/summary/interact', {
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
    }).catch(err => {
        fails++;
    })

    if (!!res) {
        const body = await res.text();
        if(JSON.parse(body).ok) {
            success++;
        }

        return JSON.parse(body).ok;
    }

    return !!res;
}

async function main(maxPlayerSweep) {
    let userList = await getListOfOnlineUsers();
    userList = userList.slice(0, maxPlayerSweep);

    if (!!userList.length) {
        for (const user of userList) {
            const [fields, monCount] = await getListOfFields(user.url);
            if (!!fields.length) {
                const maxFields = fields.length;
                let fieldCounter = 0;
                for (const field of fields) {
                    const mons = await getPokemonsAndBerryFromField(user.url, field);
                    if (!!mons.length) {
                        for (var i = 0; i < mons.length; i++) {
                            const mon = mons[i];
                            const interaction = await interactWithMonster(mon.id, mon.berry, user.url);
                            console.log(`[${user.url} (field ${field.id} (${fieldCounter}/${maxFields}))] Monster ${i}/${monCount} \t [${success}/${success + fails} (${Math.round(100 * success/(success+fails))}%)]`);
                        }
                    }
                    fieldCounter++;
                }
            }
        }
    }
}
(async () => {
   await main(25);
   console.log("Finished");
})()