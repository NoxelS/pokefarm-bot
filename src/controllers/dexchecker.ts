import {Observable} from 'rxjs';
import {filter, map, mergeMap, pairwise, switchMap} from 'rxjs/operators';
import {RequestMethod, sendServerRequestAndGetHtml} from '../utils/requests';
import {Pokedex} from "../shared/items.const";

export class PokedexEntry {
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

    constructor(id: string, name: string, type1: number, type2: number, eggs: boolean, eggdex: boolean, pkmn: boolean, pokedex: boolean, shinydex: boolean, albidex: boolean, melandex: boolean) {
        this.id = id;
        this.name = name;
        this.type1 = type1;
        this.type2 = type2;
        this.eggs = eggs;
        this.eggdex = eggdex;
        this.pkmn = pkmn;
        this.pokedex = pokedex;
        this.shinydex = shinydex;
        this.albidex = albidex;
        this.melandex = melandex;
    }

    getDexValueFromEntry(dex: Pokedex): boolean {
        if (dex == Pokedex.egg) return this.eggdex;
        if (dex == Pokedex.pkmn) return this.pokedex;
        if (dex == Pokedex.shiny) return this.shinydex;
        if (dex == Pokedex.albi) return this.albidex;
        if (dex == Pokedex.melan) return this.melandex;
        return false;
    }

    static ofArray(arr: Array<any>): PokedexEntry {
        return new PokedexEntry(
            arr[0],
            arr[1],
            arr[2],
            arr[3],
            arr[4],
            arr[5],
            arr[6],
            arr[7],
            arr[8],
            arr[9],
            arr[10],
        )
    }
}

function notInDex(dex: Pokedex): (mon: PokedexEntry) => boolean {
    return (mon: PokedexEntry) => !mon.getDexValueFromEntry(dex);
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

function retainPreStageOfAPokemonIfMissingInDex(dex: Pokedex) {
    return mergeMap(([preStage, pokemon]) => {
            if (!pokemon.getDexValueFromEntry(dex)) {
                return Array.of(preStage);
            } else {
                return [] as Array<PokedexEntry>
            }
        }
    );
}

export function getPreStageOfMissingPokedexEntries(dex: Pokedex): Observable<string> {
    return getPokedexEntries().pipe(
        pairwise(),
        retainPreStageOfAPokemonIfMissingInDex(dex),
        map(getName())
    );
}

export function getPokedexEntries(): Observable<PokedexEntry> {
    const requestURL = 'https://pokefarm.com/dex';
    return sendServerRequestAndGetHtml(requestURL, RequestMethod.Get).pipe(
        switchMap(html => {
            let regions: Array<any> = Object.values(JSON.parse(html.querySelector("#dexdata").rawText).regions);
            return ([] as Array<any>).concat(...regions);
        }),
        map(plainArray => PokedexEntry.ofArray(plainArray))
    );
}