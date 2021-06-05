export enum EvoStoneEnum {
    'Dawn' = 19,
    'Dusk' = 20,
    'Fire' = 15,
    'Ice' = 602,
    'Leaf' = 17,
    'Moon' = 18,
    'Oval' = 23,
    'Shiny' = 21,
    'Sun' = 22,
    'Thunder' = 14,
    'Water' = 16
}

export enum BerryTypeEnum {
    'aspear' = 'aspear',
    'cheri' = 'cheri',
    'chesto' = 'chesto',
    'pecha' = 'pecha',
    'rawst' = 'rawst'
}

export enum BerryTaste {
    'any' = 'any',
    'sour' = 'sour',
    'spicy' = 'spicy',
    'dry' = 'dry',
    'sweet' = 'sweet',
    'bitter' = 'bitter'
}

const berryMap = new Map<BerryTaste, BerryTypeEnum>([
    [BerryTaste.any, BerryTypeEnum.aspear],
    [BerryTaste.sour, BerryTypeEnum.aspear],
    [BerryTaste.spicy, BerryTypeEnum.cheri],
    [BerryTaste.dry, BerryTypeEnum.chesto],
    [BerryTaste.sweet, BerryTypeEnum.pecha],
    [BerryTaste.bitter, BerryTypeEnum.rawst]
]);

/** Gets berry by taste. Returns Aspear if berry is undefined */
export function getBerryByTaste(taste: BerryTaste): BerryTypeEnum {
    return berryMap.get(taste) || BerryTypeEnum.aspear;
}

export const LEGENDARIES:string[]  = [
    /*
     * List of official legendaries more or less based on
     * https://bulbapedia.bulbagarden.net/wiki/Legendary_Pok%C3%A9mon#Generation_IV
     * Kanto
     */
    'Articuno', 'Zapdos', 'Moltres', 'Mewtwo', 'Mew',
    // Johto
    'Raikou', 'Entei', 'Suicune', 'Lugia', 'Ho-oh', 'Celebi',
    // Hoenn
    'Regirock', 'Regice', 'Registeel', 'Latias', 'Latios', 'Kyogre', 'Groudon', 'Rayquaza', 'Deoxys', 'Jirachi',
    // Sinnoh
    'Uxie', 'Mesprit', 'Azelf', 'Dialga', 'Palkia', 'Heatran', 'Regigigas', 'Giratina', 'Cresselia',
    'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus',
    // Unova
    'Cobalion', 'Terrakion', 'Virizion', 'Tornadus', 'Thundurus', 'Reshiram', 'Zekrom',
    'Landorus', 'Kyurem', 'Keldeo', 'Meloetta', 'Genesect',
    // Kalos
    'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa', 'Volcanion',
    // Alola
    'Type: Null', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Tapu Bulu', 'Tapu Fini',
    'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma',
    // Galar
    'Zacian', 'Zamazenta', 'Eternatus',
    // PFQ
    /* None */
]