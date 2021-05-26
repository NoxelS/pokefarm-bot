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