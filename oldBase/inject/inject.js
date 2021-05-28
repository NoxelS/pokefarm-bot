// ==UserScript==
// @name         Injection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pokefarm.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// Grab GUI elements
const usernameGuiObject = document.getElementsByClassName('userlink0')[0];
const notificationsGui = document.getElementById('notifs');
const headRightGui = document.getElementById('head-right');
const headMiddleGui = document.getElementById('head-middle');
const headLeftGui = document.getElementById('head-left');
const userAvatarLeft = document.getElementsByClassName('profilepic')[0];
const counterPointsGui = document.getElementById('counters');

// Grab daily counters
const todaysInteractions = Number(document.querySelectorAll('[data-name]')[0].innerText.replace(',', ''));
const eggTimer = document.querySelectorAll('[data-name]')[1].innerText;

// Event listeners
const turnOffNotification = () => {
    notificationsGui.style.visibility = notificationsGui.style.visibility == 'visible' ? 'hidden' : 'visible';
};

// Misc
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

// Main Injection
(function () {
    'use strict';

    // Initital consts
    notificationsGui.style.visibility = 'hidden';
    // headMiddleGui.style.visibility = 'hidden';
    counterPointsGui.style.visibility = 'hidden';

    const currentPokerus = document.getElementById('dailybonus').lastChild.firstChild;
    const currentPokerusText = document.getElementById('dailybonus').lastChild.textContent.split(': ')[1];
    currentPokerus.innerText = 'Zum Pokerus ' + currentPokerusText;

    userAvatarLeft.children[0].src =
        'https://64.media.tumblr.com/590fd22012448b137680782bfe489cff/99a20fdb98c6d6bb-c1/s1280x1920/68c2fa694a4002ca45289b6b88e76026d9729480.png';
    document.getElementById('navbtns').style.margin = '0px';
    document.getElementById('navbookmark').style.margin = '0px';
    document.getElementById('announcement-box').style.display = 'none';
    document.getElementsByClassName('portrait_holly')[0].style.display = 'none';
    document.getElementById('content').firstChild.style.display = 'none';
    document.getElementById('navigation').style.padding = "1rem";
    document.getElementById('content').style.padding = "1rem";

    headRightGui.innerHTML = '';
    // headMiddleGui.innerHTML = '';
    headLeftGui.innerHTML = '';

    // Add buttons for control
    headRightGui.appendChild(
        createElementFromHTML(`
        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;"> 
            <button id="injectedTON">Toggle notifications</button>
            <button id="injectedPOKERUS"></button>
        </div>
    `)
    );

    document.getElementById('injectedPOKERUS').appendChild(currentPokerus);
    document.getElementById('injectedTON').addEventListener('click', turnOffNotification);
})();
