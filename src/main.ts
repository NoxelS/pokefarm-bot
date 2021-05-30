import {getPreStageOfMissingPokedexEntries, Pokedex} from './controllers/dexchecker';

// getListOfOnlineUsers()
//     .pipe(
//         map(user => user.url),
//         take(10),
//         mergeMap(getPokemonsInPartyFromUser),
//         // mergeMap(monsterid => interactWithMonster(monsterid, BerryTypeEnum.aspear)),
//         count()
//     )
//     .subscribe(console.log, _ => console.log(_));

getPreStageOfMissingPokedexEntries(Pokedex.pkmn).subscribe(mon => console.log(mon.name));
//TODO: go through each of own fields
// store Pokemon-Species-Name from Tooltip-Data in an array
// compare PreStageOfMissingPokemon with PokemonInFields for entries included in both
//  manually search for the pokemon in your fields and see how they evolve