const countLinesInFile = require('count-lines-in-file');
const fs = require('fs');
const path = require('path');
const targetFilePath = path.resolve(__dirname, './monsters.db');
const readline = require('readline');
const fetch = require('node-fetch');
const parse = require('node-html-parser');
const AbortController = require('abort-controller');
const shuffle = require('shuffle-array');
const filelog = require('log-to-file');
const http = require('http');
const https = require('https');
require('dotenv').config()

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });
const agent = _parsedURL => (_parsedURL.protocol == 'http:' ? httpAgent : httpsAgent);

const logError = msg => {
    filelog(msg, 'errors.log');
};

const GLOBALCOOKIE = process.env.cookie;

var fails = 0;
var success = 0;
var totalpokemons = 0;

const lineReader = readline.createInterface({
    input: require('fs').createReadStream('monsters.db')
});

async function countLines() {
    countLinesInFile(targetFilePath, (error, numberOfLines) => {
        if (!error) {
            console.log('Found ' + numberOfLines + ' pokemons to interact with');
            totalpokemons = numberOfLines - 1;
            main(0);
        }
    });
}

async function interactWithMonster(monsterID, berry, username) {
    const res = await fetch('https://pokefarm.com/summary/interact', {
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
        mode: 'cors',
        agent
    }).catch(err => {
        fails++;
    });

    if (!!res) {
        const body = await res.text();
        if (JSON.parse(body).ok) {
            success++;
        }
        return JSON.parse(body).ok;
    }
    return !!res;
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function main(speed) {
    const data = fs.readFileSync('./monsters.db', { encoding: 'utf-8' });
    const monsters = data.split(/\r?\n/g).map(line => {
        if (!!line) {
            return JSON.parse(line);
        } else {
            return;
        }
    });

    let count = 0;

    shuffle(monsters);

    for (const monster of monsters) {
        await interactWithMonster(monster.id, monster.berry, monster.username);
        if(count % 100 == 0) {
            console.log(
                `Interaction ${count}/${totalpokemons} (${Math.round((10000 * count) / totalpokemons) / 10000}%) Successrate: ${success}/${fails + success} (${
                    Math.round((10000 * success) / (fails + success)) / 100
                }%)}`
            );
        }
        count++;
    }
}

countLines();
