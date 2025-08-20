const { FieldPath } = require('firebase-admin/firestore');
module.exports = function (db) {
    return function (req, res) {
        const { idLiga, idLigaJuego } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        if (!idLigaJuego)
            return res.status(404).send({ err: 'No se ha enviado un id de liga del juego' });
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
                    .collection('LigasJuego')
                    .doc(id)
                    .get()
                    .then((doc) => {
                        const ligaJuegoData = doc.data();
                        const fechaActualizacion = ligaJuegoData.fechaActualizacion.toDate();
                        return db
                            .collection('LigasJuego')
                            .doc(id)
                            .collection('Mercado')
                            .get()
                            .then((querySnapshot) => {
                                const marketPlayersIds = [];
                                querySnapshot.forEach((i) => {
                                    const data = i.data();
                                    marketPlayersIds.push(data.idJugador);
                                });
                                return db
                                    .collection('Ligas')
                                    .where('idLiga', '==', idLiga)
                                    .get()
                                    .then((querySnapshot) => {
                                        let id2 = 0;
                                        querySnapshot.forEach((i) => {
                                            id2 = i.id;
                                        });
                                        const leagueRef = db.collection('Ligas').doc(id2);
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
                                                        return marketPlayersIds.includes(
                                                            data.idJugador,
                                                        );
                                                    },
                                                );
                                                allPlayers.push(
                                                    ...filteredPlayers.map((doc) => doc.data()),
                                                );
                                                allPlayers.sort((a, b) => {
                                                    const order = {
                                                        Portero: 0,
                                                        Defensa: 1,
                                                        Mediocampista: 2,
                                                        Delantero: 3,
                                                    };
                                                    return order[a.posicion] - order[b.posicion];
                                                });
                                                return res.status(200).send({
                                                    data: allPlayers,
                                                    fechaActualizacion,
                                                });
                                            });
                                    });
                            });
                    });
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'No se encontró un documento con ese idLiga o idLigaJuego',
                    error,
                }),
            );
    };
};
