const retus = require('retus');
const parse = require('node-html-parser');

const GLOBALCOOKIE = '64ee244e01f257ec141ed90a91219a3b';

var lastInteractions;

async function getStats() {
    const { body } = retus('https://pokefarm.com/', {
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
        lastInteractions = { time: new Date().getTime(), interactions };
    }

    console.log(
        `${name} - [${new Date().toLocaleTimeString()}] Interactions: ${interactions} (${nteractionsPerSeconds}/s) \t EggLevel: ${eggLevel}\t Money: ${credits}, ${creditsGold}, ${creditsBlue}\t Online: ${online}`
    );
}

getStats();
setInterval(() => {
    getStats();
}, 2000);
