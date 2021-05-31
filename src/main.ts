import {
    getFieldsFromUser,
    getPokemonFromField,
    getPreStageOfMissingPokedexEntries,
    Pokedex
} from './controllers/dexchecker';
import {distinct, last, map, mergeMap, mergeWith, scan} from "rxjs/operators";

// getListOfOnlineUsers()
//     .pipe(
//         map(user => user.url),
//         take(10),
//         mergeMap(getPokemonsInPartyFromUser),
//         // mergeMap(monsterid => interactWithMonster(monsterid, BerryTypeEnum.aspear)),
//         count()
//     )
//     .subscribe(console.log, _ => console.log(_));


const user = "Skiddie";
const pokemonFromUser = getFieldsFromUser(user).pipe(
    mergeMap(field => {
        return getPokemonFromField(user, field.id);
    }),
    distinct()
);

getPreStageOfMissingPokedexEntries(Pokedex.pkmn).pipe(
    map(entry => entry.name),
    mergeWith(pokemonFromUser),
    scan(([dupes, uniques], next) =>
            [uniques.has(next) ? dupes.add(next) : dupes, uniques.add(next)],
        [new Set(), new Set()]
    ),
    map(([dupes]) => dupes),
    last()
).subscribe(console.log);
