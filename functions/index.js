const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const serviceAccount = require('./config/bemanager-ecf7e-firebase-adminsdk-fbsvc-2e28046f0b.json');
const createUser = require('./createUser');
const createLeagues = require('./createLeagues');
const saveDataToDB = require('./saveDataToDB');
const getLeagues = require('./getLeagues');
const createGameLeague = require('./createGameLeague');
const getMyGameLeagues = require('./getMyGameLeagues');
const getGameLeagues = require('./getGameLeagues');
const joinGameLeague = require('./joinGameLeague');
const getTeams = require('./getTeams');
const getPlayers = require('./getPlayers');
const getStandings = require('./getStandings');
const startGameLeague = require('./startGameLeague');
const updateMarket = require('./updateMarket');
const resolveBids = require('./resolveBids');
const updateStandings = require('./updateStandings');
const distributeRewards = require('./distributeRewards');
const getMarket = require('./getMarket');
const getSquad = require('./getSquad');
const getBudget = require('./getBudget');
const makeBid = require('./makeBid');
const sellPlayer = require('./sellPlayer');
const startRound = require('./startRound');
const endRound = require('./endRound');
const updateValues = require('./updateValues');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.createUser = onRequest(createUser);
exports.createLeagues = onRequest(createLeagues(db));
exports.saveDataToDB = onRequest(saveDataToDB(db));
exports.getLeagues = onRequest(getLeagues(db));
exports.createGameLeague = onRequest(createGameLeague(db));
exports.getMyGameLeagues = onRequest(getMyGameLeagues(db));
exports.getGameLeagues = onRequest(getGameLeagues(db));
exports.joinGameLeague = onRequest(joinGameLeague(db));
exports.getTeams = onRequest(getTeams(db));
exports.getPlayers = onRequest(getPlayers(db));
exports.getStandings = onRequest(getStandings(db));
exports.startGameLeague = onRequest(startGameLeague(db));
exports.updateMarket = onRequest(updateMarket(db));
exports.resolveBids = onRequest(resolveBids(db));
exports.updateStandings = onRequest(updateStandings(db));
exports.distributeRewards = onRequest(distributeRewards(db));
exports.getMarket = onRequest(getMarket(db));
exports.getSquad = onRequest(getSquad(db));
exports.getBudget = onRequest(getBudget(db));
exports.makeBid = onRequest(makeBid(db));
exports.sellPlayer = onRequest(sellPlayer(db));
exports.startRound = onRequest(startRound(db));
exports.endRound = onRequest(endRound(db));
exports.updateValues = onRequest(updateValues(db));
