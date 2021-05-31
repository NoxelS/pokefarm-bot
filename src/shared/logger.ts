import { UserStats } from '../controllers/stats';


var userStats: UserStats;
var lastInteractions = 0;
var increaseInInteractions = 0;
var lastStatsTimestamp: number;

export function log(msg: any) {
    if(userStats) {
        console.log(`[${userStats.name}][${new Date().toLocaleTimeString()}] ${msg}`);
    } else {
        console.log(`[${new Date().toLocaleTimeString()}]: ` + msg);
    }
}

export function logStats(stats: UserStats) {
    userStats = stats;
    
    increaseInInteractions = Number(stats.interactions) - lastInteractions;
    const interactionsPerSecond = increaseInInteractions/(new Date().getTime() - lastStatsTimestamp)
    
    console.log(`[${userStats.name}][${new Date().toLocaleTimeString()}] Interactions: ${userStats.interactions} (+${increaseInInteractions}) [${Math.round( 100 * 1000 * interactionsPerSecond)/100}/s] Credits: ${userStats.credits} EGG: ${userStats.eggLevel}lvl`);
    lastInteractions = Number(stats.interactions);
    lastStatsTimestamp = new Date().getTime();
}