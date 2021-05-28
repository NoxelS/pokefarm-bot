// Buy new field
fetch("https://pokefarm.com/contest/blend/submit", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Accept": "application/json, text/javascript, /; q=0.01",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "X-Requested-With": "Love",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pokefarm.com/contest/blend",
    "body": "{\"berry\":111,\"score\":[0,0,100],\"maxrpm\": 100}",
    "method": "POST",
    "mode": "cors"
});

// Finish Training
await fetch("https://pokefarm.com/dojo/training/finish", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "X-Requested-With": "Love",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pokefarm.com/dojo/training",
    "body": "{\"id\":\"_BRYn\"}", // Monster trainings id
    "method": "POST",
    "mode": "cors"
});

// Neues Training
await fetch("https://pokefarm.com/dojo/training/train", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "X-Requested-With": "Love",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pokefarm.com/dojo/training",
    "body": "{\"id\":\"_BRYn\",\"bags\":[\"315\",\"315\",\"315\",\"315\",\"315\",\"315\"]}", // 315 is bag id
    "method": "POST",
    "mode": "cors"
});

// Retrieve from scour mission
await fetch("https://pokefarm.com/scour/retrieve", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "X-Requested-With": "Love",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pokefarm.com/scour",
    "body": "{\"pid\":\"_Bbqr\"}",
    "method": "POST",
    "mode": "cors"
});

// Send to mission
await fetch("https://pokefarm.com/scour/send", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "X-Requested-With": "Love",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pokefarm.com/scour",
    "body": "{\"pid\":\"_Bbqr\",\"locid\":\"1\"}",
    "method": "POST",
    "mode": "cors"
});

// FIshing start
await fetch("https://pokefarm.com/fishing/fish.cast", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "X-Requested-With": "Love",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pokefarm.com/fishing",
    "body": "{\"mutex\":\"60aeb86a8a938\",\"spot\":3}",
    "method": "POST",
    "mode": "cors"
});

// Fish hook
await fetch("https://pokefarm.com/fishing/fish.hook", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/json",
        "X-Requested-With": "Love",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pokefarm.com/fishing",
    "body": "{\"mutex\":\"60aeb86a8a938\",\"event\":\"hook\"}",
    "method": "POST",
    "mode": "cors"
});

// Release Pokemon to shelter
await fetch("https://pokefarm.com/summary/release", {
    "headers": {
        "accept": "application/json, text/javascript, /; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/summary/_BJBW",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"pid\":\"_BJBW\",\"confirm\":\"8f8135ca556cc6401caf745e0f2de5e6\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// Evolve Pokemon
fetch("https://pokefarm.com/summary/evolve", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/farm",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"id\":\"_HhgV\",\"expect\":\"732\",\"returnmode\":\"simple\",\"confirmed\":true}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
});
// Ich glaube das "Expect" bezieht sich auf die Species-ID des Pokemon (https://pokefarm.com/dex/732) (geht von 001 bis 889), das man haben möchte: Manche Pokmeon können sich in verschiedene entwickeln, was man selbst beeinflussen kann.

// Plant a berry
fetch("https://pokefarm.com/garden/plant", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/garden",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"berry\":71,\"mulch\":165}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
});

// Water plants
fetch("https://pokefarm.com/garden/water", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/garden",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"slot\":1}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});
// even when watering all slots, it sends multiple requests

// Harvest plants
await fetch("https://pokefarm.com/garden/harvest", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/garden",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"slot\":2}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// Buy Mulch (could just do 1000 or so in advance)
await fetch("https://pokefarm.com/garden/buy.mulch", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/garden",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"id\":165,\"q\":1,\"confirm\":1}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// get available berries
fetch("https://pokefarm.com/farm/inventory", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/garden",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"filter\":\"plantBerry\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// get available Mulch
fetch("https://pokefarm.com/farm/inventory", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/garden",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"filter\":\"plantMulch\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// complete task
fetch("https://pokefarm.com/party/tasklist_complete", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/party",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"id\":75}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// Buy new Field
fetch("https://pokefarm.com/fields/buy", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/fields",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"purchase\":\"unknown1\",\"fieldname\":\"Sour 2\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
});

// Organise fields
fetch("https://pokefarm.com/fields/setorder", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/fields",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"order\":[0,1,2,3,33,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,30,32],\"visibilities\":{}}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

//massmove pokemon
fetch("https://pokefarm.com/fields/massmove", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/fields",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"pids\":[\"_mTzg\",\"_mTyq\",\"_mTyZ\",\"_m6gn\",\"_mkJR\"],\"field\":4}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// get shelter pokemon
fetch("https://pokefarm.com/shelter/load", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/shelter",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// Adopt pokemon from shelter
fetch("https://pokefarm.com/shelter/adopt", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/shelter",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"id\":\"_B1vC\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

// Challenge sparring
fetch("https://pokefarm.com/dojo/sparring/challenge", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/dojo/sparring",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"username\":\"Pokemania\",\"pokemon\":\"_rMcf\",\"message\":\"\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
});

// Fishing:
//GET https://pokefarm.com/fishing
// id="fishing" data-mutex="60afa1b57a89d"
fetch("https://pokefarm.com/fishing/fish.start", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/fishing",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"mutex\":\"60afa1b57a89d\",\"area\":2,\"newgame\":true}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
});

fetch("https://pokefarm.com/fishing/fish.cast", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/fishing",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"mutex\":\"60afa1b57a89d\",\"spot\":0}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

fetch("https://pokefarm.com/fishing/fish.hook", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/fishing",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"mutex\":\"60afa1b57a89d\",\"event\":\"hook\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

fetch("https://pokefarm.com/fishing/fish.battle", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "Love"
    },
    "referrer": "https://pokefarm.com/fishing",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"mutex\":\"60afa1b57a89d\",\"action\":\"ball-597\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});
// Other action = "rock" -> response refreshes Strength and Wrath
// Irgendwann enthält die Response vom Bällewerfen, dass man das Pokemon gefangne hat oder eben nicht.
// Dann wieder fish.start -> fish.cast -> fish.hook -> fish.battle mit gleichem Mutex.