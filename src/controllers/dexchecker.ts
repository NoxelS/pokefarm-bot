import {Observable} from 'rxjs';
import {filter, map, mergeMap, pairwise, switchMap} from 'rxjs/operators';
import {RequestMethod, sendServerRequestAndGetHtml} from '../utils/requests';
import {Pokedex} from "../shared/items.const";

export interface PokedexEntry {
    id: string;
    name: string;
    type1: number;
    type2: number;
    eggs: boolean;
    eggdex: boolean;
    pkmn: boolean;
    pokedex: boolean;
    shinydex: boolean;
    albidex: boolean;
    melandex: boolean;
}

function getDexValueFromEntry(dex: Pokedex, entry: PokedexEntry): boolean {
    if (dex == Pokedex.egg) return entry.eggdex;
    if (dex == Pokedex.pkmn) return entry.pokedex;
    if (dex == Pokedex.shiny) return entry.shinydex;
    if (dex == Pokedex.albi) return entry.albidex;
    if (dex == Pokedex.melan) return entry.melandex;
    return false;
}

function notInDex(dex: Pokedex): (mon: PokedexEntry) => boolean {
    return (mon: PokedexEntry) => !getDexValueFromEntry(dex, mon);
}

function getName() {
    return (mon: PokedexEntry) => mon.name;
}

export function getMissingPokedexEntries(dex: Pokedex): Observable<string> {
    return getPokedexEntries().pipe(
        filter(notInDex(dex)),
        map(getName())
    );
}

export function getPreStageOfMissingPokedexEntries(dex: Pokedex): Observable<string> {
    return getPokedexEntries().pipe(
        pairwise(),
        mergeMap(([preStage, pokemon]) => {
                if (!getDexValueFromEntry(dex, pokemon)) {
                    return Array.of(preStage);
                } else {
                    return [] as Array<PokedexEntry>
                }
            }
        ),
        map(getName())
    );
}

export function getPokedexEntries(): Observable<PokedexEntry> {
    const requestURL = 'https://pokefarm.com/dex';
    return sendServerRequestAndGetHtml(requestURL, RequestMethod.Get).pipe(
        switchMap(html => {
            const allPokemon = Object.values(JSON.parse(html.querySelector("#dexdata").rawText).regions);
            return ([] as Array<any>).concat(...allPokemon); //any or PokedexEntry?
        })
    );
}