const { FieldPath } = require('firebase-admin/firestore');

module.exports = function (db) {
    return function (req, res) {
        const { idLiga, lastVisible } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        return db
            .collection('Ligas')
            .where('idLiga', '==', idLiga)
            .get()
            .then((querySnapshot) => {
                let id = 0;
                querySnapshot.forEach((i) => {
                    id = i.id;
                });
                const leagueRef = db.collection('Ligas').doc(id);
                let query = db
                    .collectionGroup('Jugadores')
                    .orderBy(FieldPath.documentId())
                    .startAt(leagueRef.path)
                    .endAt(leagueRef.path + '\uf8ff')
                    .limit(20);
                if (lastVisible) {
                    return db
                        .doc(lastVisible)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                query = query.startAfter(doc);
                            }
                            return query.get();
                        });
                }
                return query.get();
            })
            .then((playersSnapshot) => {
                const players = [];
                let newLastVisible = null;
                playersSnapshot.forEach((playerDoc) => {
                    players.push(playerDoc.data());
                    newLastVisible = playerDoc;
                });
                console.log('Response sent:', {
                    data: players,
                    lastVisible: newLastVisible ? newLastVisible.id : null,
                });
                return res.status(200).send({
                    data: players.length > 0 ? players : [],
                    lastVisible: newLastVisible ? newLastVisible.ref.path : null,
                });
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'No se encontró un documento con ese idLiga',
                    error: error.message,
                }),
            );
    };
};
