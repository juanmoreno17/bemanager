/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https');
//const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const serviceAccount = require('./config/bemanager-ecf7e-firebase-adminsdk-fbsvc-2e28046f0b.json');
const posts = require('./posts');
const createUser = require('./createUser');
const createLeagues = require('./createLeagues');
const saveDataToDB = require('./saveDataToDB');
const getLeagues = require('./getLeagues');
const example = require('./example');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/*exports.helloWorld = onRequest((request, response) => {
    logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});*/

exports.posts = onRequest(posts(db));
exports.createUser = onRequest(createUser);
exports.createLeagues = onRequest(createLeagues(db));
exports.saveDataToDB = onRequest(saveDataToDB(db));
exports.getLeagues = onRequest(getLeagues(db));
exports.example = onRequest(example(db));
