const retus = require('retus');
const parse = require('node-html-parser');
const fetch = require('node-fetch');

const GLOBALCOOKIE = '96dd4eb0774a2fc6b486b159ccfb1e37';

var lastInteractions;

async function collectTrainingBags(cookie, pokemon) {
    fetch('https://pokefarm.com/dojo/training/collect', {
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0',
            Accept: 'application/json, text/javascript, /; q=0.01',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Content-Type': 'application/json',
            'X-Requested-With': 'Love',
            'Sec-GPC': '1',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            cookie: `PFQSID=${cookie}`
        },
        referrer: 'https://pokefarm.com/fields/Niet',
        body: `{"id":"${pokemon}"}`,
        method: 'POST',
        mode: 'cors'
    }).then(() => {
    });
}

async function adoptEgg(newEggBody) {
    return fetch('https://pokefarm.com/lab/adopt', {
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
        referrer: 'https://pokefarm.com/user/Niet',
        body: newEggBody,
        method: 'POST',
        mode: 'cors'
    });
}

function moveHatchedPokemon(eggID) {
    return fetch('https://pokefarm.com/fields/movetofield', {
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
        referrer: 'https://pokefarm.com/user/Niet',
        body: `{"id":"${eggID}", "field":${fieldID}, "getEmptySlot":true}`,
        method: 'POST',
        mode: 'cors'
    });
}

function hatchEgg(eggID) {
    return fetch('https://pokefarm.com/summary/hatch', {
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
        referrer: 'https://pokefarm.com/user/Niet',
        body: `{"id":"${eggID}"}`,
        method: 'POST',
        mode: 'cors'
    });
}

async function getNewEgg() {
    const res = await fetch('https://pokefarm.com/lab/eggs', {
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
        referrer: 'https://pokefarm.com/user/Niet',
        body: `{}`,
        method: 'POST',
        mode: 'cors'
    }).catch(err => {
        fails++;
        logError(err);
    });

    if (!!res) {
        const body = await res.text();
        const eggData = JSON.parse(body);
        const eggs = eggData.eggs;
        const timestamp = eggData.targettime;
        let newEgg = `{"egg": ${3}, "key": ${timestamp}}`; //Default

        eggs.forEach((egg, index) => {
            if (egg.name === "???????") {
                newEgg = `{"egg": ${index}, "key": ${timestamp}}`;
            }
        });

        return newEgg;
    }
}

async function adoptNewEgg() {
    const newEggBody = await getNewEgg();
    if (!!newEggBody) {
        await adoptEgg(newEggBody).then(() => {
            console.log("Adopted new egg!");
        });
    }
}

async function hatchPartyEggs() {
    const res = await fetch('https://pokefarm.com/party', {
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
            'https://pokefarm.com/user/Niet?src=~online',
        method: 'GET',
        mode: 'cors'
    }).catch(err => {
        fails++;
        logError(err);
    });

    if (!!res) {
        const body = await res.text();
        const partyMembers = parse.parse(body).querySelector('.party').childNodes;

        for (const member of partyMembers) {
            const egg = member.rawAttrs;
            const eggID = egg.substring(
                egg.indexOf('"') + 1,
                egg.lastIndexOf('"')
            );

            if (eggID.length === 0) {
                // Slot is empty for whatever reason
                await adoptNewEgg();
                continue;
            }

            if (!member.querySelector('.action').innerHTML.includes("Hatch")) {
                // Egg not ready to hatch
                continue;
            }

            await hatchEgg(eggID).then(async () => {
                console.log("Egg hatched:", eggID);

                await moveHatchedPokemon(eggID).then(async () => {
                    console.log("Moved egg to fields:", eggID);
                    await adoptNewEgg();
                });
            });
        }
    }
}

async function skipInteractionWarning(cookie) {
    await fetch('https://pokefarm.com/summary/interact-warning', {
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
            cookie: `PFQSID=${cookie}`
        },
        referrer: 'https://pokefarm.com/user/Pokemania',
        body: 'null',
        method: 'POST',
        mode: 'cors'
    });
}

async function getStats() {
    const {body} = retus('https://pokefarm.com/', {
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
    });

    var interactions = 0;
    var eggLevel = 0;
    parse
        .parse(body)
        .querySelectorAll('[data-name]')
        .forEach(dataObject => {
            if (dataObject.firstChild._attrs.title == "Today's Interactions") {
                interactions = dataObject.firstChild.innerText.replace(/\D/g, '');
            }

            if (dataObject.firstChild._attrs.title == 'Egg Timer') {
                eggLevel = dataObject.firstChild.innerText.replace(/\D/g, '');
            }
        });

    const credits = parse.parse(body).querySelector('#c_credits').innerText.replace(/\D/g, '');
    const creditsGold = parse.parse(body).querySelector('#c_gold').innerText.replace(/\D/g, '');
    const creditsBlue = parse.parse(body).querySelector('#c_zophan').innerText.replace(/\D/g, '');

    const name = parse.parse(body).querySelector('.userlink0').innerText;
    const online = parse.parse(body).querySelectorAll('[href="/online"]')[0].innerText.replace(/\D/g, '');

    var nteractionsPerSeconds;
    if (lastInteractions) {
        nteractionsPerSeconds =
            Math.round((100 * 1000 * (interactions - lastInteractions.interactions)) / (new Date().getTime() - lastInteractions.time)) / 100;
    } else {
        lastInteractions = {time: new Date().getTime(), interactions};
    }

    console.log(
        `${name} - [${new Date().toLocaleTimeString()}] Interactions: ${interactions} (${nteractionsPerSeconds}/s) +${
            interactions - lastInteractions.interactions
        } \t EggLevel: ${eggLevel}\t Money: ${credits}, ${creditsGold}, ${creditsBlue}\t`
    );
}

const trainingPokemon = '_HjWN';
const fieldID = 31;

getStats();
setInterval(() => {
    getStats();
    collectTrainingBags(GLOBALCOOKIE, trainingPokemon);
    skipInteractionWarning(GLOBALCOOKIE);
}, 2000);

setInterval(() => {
    hatchPartyEggs();
}, 600000);