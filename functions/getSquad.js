const { FieldPath } = require('firebase-admin/firestore');
module.exports = function (db) {
    return function (req, res) {
        const { idLiga, idLigaJuego, idUsuario } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        if (!idLigaJuego)
            return res.status(404).send({ err: 'No se ha enviado un id de liga del juego' });
        if (!idUsuario) return res.status(404).send({ err: 'No se ha enviado un id de usuario' });
        return db
            .collection('LigasJuego')
            .where('idLigaJuego', '==', idLigaJuego)
            .get()
            .then((querySnapshot) => {
                let id = 0;
                querySnapshot.forEach((i) => {
                    id = i.id;
                });
                return db
                    .collection(`LigasJuego/${id}/Jugadores`)
                    .where('idUsuario', '==', idUsuario)
                    .get()
                    .then((querySnapshot) => {
                        let id2 = 0;
                        querySnapshot.forEach((i) => {
                            id2 = i.id;
                        });
                        return db
                            .doc(`LigasJuego/${id}/Jugadores/${id2}`)
                            .get()
                            .then((docSnapshot) => {
                                const squadPlayersIds = [];
                                const data = docSnapshot.data();
                                if (data.plantilla) {
                                    squadPlayersIds.push(...data.plantilla);
                                }
                                return db
                                    .collection('Ligas')
                                    .where('idLiga', '==', idLiga)
                                    .get()
                                    .then((querySnapshot) => {
                                        let id3 = 0;
                                        querySnapshot.forEach((i) => {
                                            id3 = i.id;
                                        });
                                        const leagueRef = db.collection('Ligas').doc(id3);
                                        return db
                                            .collectionGroup('Jugadores')
                                            .orderBy(FieldPath.documentId())
                                            .startAt(leagueRef.path)
                                            .endAt(leagueRef.path + '\uf8ff')
                                            .get()
                                            .then((playersSnapshot) => {
                                                const allPlayers = [];
                                                const filteredPlayers = playersSnapshot.docs.filter(
                                                    (doc) => {
                                                        const data = doc.data();
                                                        return squadPlayersIds.includes(
                                                            data.idJugador,
                                                        );
                                                    },
                                                );
                                                allPlayers.push(
                                                    ...filteredPlayers.map((doc) => doc.data()),
                                                );
                                                return res.status(200).send({
                                                    data: allPlayers,
                                                });
                                            });
                                    });
                            });
                    });
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'No se encontró un documento con ese idLiga o idLigaJuego',
                    error: error.message,
                }),
            );
    };
};
