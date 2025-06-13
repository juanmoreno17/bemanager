const { FieldPath } = require('firebase-admin/firestore');

module.exports = function (db) {
    return function (req, res) {
        const { idLiga } = req.body;
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
                return db
                    .collectionGroup('Jugadores')
                    .orderBy(FieldPath.documentId())
                    .startAt(leagueRef.path)
                    .endAt(leagueRef.path + '\uf8ff')
                    .get()
                    .then((playersSnapshot) => {
                        const players = [];
                        playersSnapshot.forEach((playerDoc) => {
                            players.push(playerDoc.data());
                        });
                        return res.status(200).send({ data: players });
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
