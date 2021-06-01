import { interval } from 'rxjs';
import { filter, retry, switchMap, tap } from 'rxjs/operators';

import { collectTrainingBags } from './controllers/dojo';
import { evolveAllPokemons, hatchPartyEggs } from './controllers/eggs';
import { ddosPokerusUser } from './controllers/events';
import { interactWithAllClickbackMonster } from './controllers/interact';
import { handleScourMissions } from './controllers/scours';
import { buyAlbinoRadarIfPossibleAndSellIt } from './controllers/shop';
import { getUserStats } from './controllers/stats';
import { skipInteractionWarning } from './shared/interaction-warning';
import { log, logStats } from './shared/logger';


/**
 * The main flow should handle the following things:
 *      - get user stats to track progress (10s)
 *      - retrieve training bags (10s)
 *      - hatch eggs - put them in fields - buy new eggs (5s)
 *      - restart scour mission (60s)
 *      - buy albino radars and sell them (10min)
 *      - upgrade wishforge (10min)
 *      - water plants and manage berries (10min)
 *      - clickback interactions (60s)
 *      - hold the eggs of other players until egg lvl 10 is reached (10s if not egg lvl 10)
 */

/** Controll intervals */
const [veryfast, fast, slow, veryslow] = [5, 10, 60, 15 * 60].map(seconds => seconds * 1000);

/** Fast interval  */
const fastHandler = interval(veryfast)
    .pipe(
        switchMap(() => skipInteractionWarning()),
        switchMap(() => getUserStats().pipe(tap(logStats))),
        switchMap(() =>
            collectTrainingBags().pipe(
                filter(res => res.ok),
                tap(res => {
                    log('Collected training bags!');
                }),
                retry(1)
            )
        )
    )
    .subscribe();

/** Slow interval  */
const slowHandler = interval(fast)
    .pipe(
        switchMap(() => hatchPartyEggs()),
        switchMap(() => interactWithAllClickbackMonster().pipe(tap(log)))
    )
    .subscribe();

/** Shop actions */
const shopActions = interval(slow)
    .pipe(switchMap(() => buyAlbinoRadarIfPossibleAndSellIt()))
    .subscribe(_ => log(`Bought and sold an albino radar!`));

/** Monster evos */
const evos = interval(veryslow)
    .pipe(switchMap(() => evolveAllPokemons()))
    .subscribe(() => {
        log('Evolved a pokemon');
    });

/** Pokerus ddos */
const pokerus = interval(fast)
    .pipe(switchMap(() => ddosPokerusUser()))
    .subscribe();

const scour = interval(veryslow)
    .pipe(
        switchMap(() =>
            handleScourMissions().pipe(
                filter(res => res.ok),
                tap(log)
            )
        )
    )
    .subscribe();
