import {Observable} from 'rxjs';
import {filter, map, mergeMap, pairwise, switchMap} from 'rxjs/operators';
import {RequestMethod, sendServerRequest, sendServerRequestAndGetHtml} from '../utils/requests';
import parse from "node-html-parser";

/**
 * Maps the five Pokedexes (Pokedices?) to the array index they have in the PokeFarm code
 */
export enum Pokedex {
    'egg' = 5,
    'pkmn' = 7,
    'shiny' = 8,
    'albi' = 9,
    'melan' = 10
}

/**
 * @param eggs Whether this Pokemon can directly hatch from an egg without having to evolve.
 * @param eggdex Whether this Pokemon is registered in the player's Eggdex, i. e. if the player has hatched that egg already.
 * @param pkmn Whether this Pokemon is a Pokemon. Guess this is mostly true.
 * @param pokedex Whether this Pokemon is registered in the player's Pokedex, i. e. if the player was in control of this Pokemon already.
 */
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

    getDexValue(dex: Pokedex): boolean {
        if (dex == Pokedex.egg) return this.eggdex;
        if (dex == Pokedex.pkmn) return this.pokedex;
        if (dex == Pokedex.shiny) return this.shinydex;
        if (dex == Pokedex.albi) return this.albidex;
        if (dex == Pokedex.melan) return this.melandex;
        return false;
    }

    static fromArray(arr: Array<any>): PokedexEntry {
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
    return (mon: PokedexEntry) => !mon.getDexValue(dex);
}

export function getMissingPokedexEntries(dex: Pokedex): Observable<PokedexEntry> {
    return getPokedexEntries().pipe(
        filter(notInDex(dex))
    );
}

/**
 * This returns the Pokemon directly before a missing Pokemon that can not hatch from an egg (i. e. a Pokemon that can only be acquired through evolution).
 * Usually the Pokemon directly before such a Pokemon is a Pokemon that can evolve to the missing Pokemon. Exceptions maybe are Pokemon that got their evolution(s) in later generations of the game.
 * Using some kind of Map of evolutions would be much better, both semantically and syntactically.
 * @param dex The dex that a Pokemon is potentially missing in.
 */
function retainPreStageOfAPokemonIfMissingInDex(dex: Pokedex) {
    return mergeMap(([preStage, pokemon]) => {
            if (!pokemon.getDexValue(dex) && !pokemon.eggs && !preStage.name.includes('???')) {
                return Array.of(preStage);
            } else {
                return [] as Array<PokedexEntry>
            }
        }
    );
}

export function getPreStageOfMissingPokedexEntries(dex: Pokedex): Observable<PokedexEntry> {
    return getPokedexEntries().pipe(
        pairwise(),
        retainPreStageOfAPokemonIfMissingInDex(dex)
    );
}

export function getPokedexEntries(): Observable<PokedexEntry> {
    const requestURL = 'https://pokefarm.com/dex';
    return sendServerRequestAndGetHtml(requestURL, RequestMethod.Get).pipe(
        switchMap(html => {
            let regions: Array<any> = Object.values(JSON.parse(html.querySelector("#dexdata").rawText).regions);
            return ([] as Array<any>).concat(...regions);
        }),
        map(plainArray => PokedexEntry.fromArray(plainArray))
    );
}

export class Field {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromJSON(json: any) {
        return new Field(json.id, json.name);
    }

}

export function getFieldsFromUser(user: String): Observable<Field> {
    const requestURL = 'https://pokefarm.com/fields/fieldlist';
    console.log(user);
    return sendServerRequest<string>(requestURL, RequestMethod.Post, `{uid: "${user}"}`).pipe(
        switchMap(body => JSON.parse(body).fields),
        map(field => Field.fromJSON(field))
    );
}

export function getPokemonFromField(user: String, fieldId: number): Observable<string> {
    const requestURL = 'https://pokefarm.com/fields/field';
    return sendServerRequest<string>(requestURL, RequestMethod.Post, `{"id": ${fieldId}, "uid": "${user}", "mode": "public"}`).pipe(
        map(body => parse(JSON.parse(body).html)),
        switchMap(html => html.querySelectorAll(".fieldmontip")), //TODO you can easily get ".fieldmon" here
        map(fieldmon => fieldmon.childNodes[3].childNodes[3].rawText.trim()) // TODO and then getAttribute("data-pid") here
    );
}