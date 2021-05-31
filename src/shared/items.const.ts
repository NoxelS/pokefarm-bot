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