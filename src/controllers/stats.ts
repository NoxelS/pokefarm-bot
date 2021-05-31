import { map } from 'rxjs/operators';

import { RequestMethod, sendServerRequestAndGetHtml } from '../utils/requests';


interface UserStats {
    credits: number;
    creditsGold: number;
    creditsBlue: number;
    interactions: number;
    eggLevel: number;
    name: string;
}

export function getUserStats() {
    return sendServerRequestAndGetHtml('https://pokefarm.com/', RequestMethod.Get).pipe(
        map(body => {
            let interactions: number = 0,
                eggLevel: number = 0;

            body.querySelectorAll('[data-name]').forEach(dataObject => {
                if (dataObject.attributes['data-name'] == "Today's Interactions") {
                    interactions = Number(dataObject.firstChild.innerText.replace(/\D/g, ''));
                }

                if (dataObject.attributes['data-name'] == 'Egg Timer') {
                    eggLevel = Number(dataObject.firstChild.innerText.replace(/\D/g, ''));
                }
            });

            const credits = Number(body.querySelector('#c_credits').innerText.replace(/\D/g, ''));
            const creditsGold = Number(body.querySelector('#c_gold').innerText.replace(/\D/g, ''));
            const creditsBlue = Number(body.querySelector('#c_zophan').innerText.replace(/\D/g, ''));

            const name = body.querySelector('.userlink0').innerText;

            return <UserStats>{
                credits,
                creditsGold,
                creditsBlue,
                interactions,
                eggLevel,
                name
            };
        })
    );
}
