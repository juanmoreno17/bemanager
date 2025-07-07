const { FieldValue, FieldPath } = require('firebase-admin/firestore');

module.exports = function (db) {
    return function (req, res) {
        const { idLiga, idLigaJuego, idUsuario, idJugador } = req.body;
        console.log(req.body);
        console.log(typeof req.body.idLigaJuego);
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        if (!idLigaJuego || idLigaJuego.trim() === '')
            return res.status(404).send({ err: 'No se ha enviado un id de liga del juego' });
        if (!idUsuario) return res.status(404).send({ err: 'No se ha enviado un id de usuario' });
        if (!idJugador) return res.status(404).send({ err: 'No se ha enviado un id de jugador' });
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
                    .collection('Jugadores')
                    .where('idUsuario', '==', idUsuario)
                    .get()
                    .then((querySnapshot) => {
                        let id2 = 0;
                        querySnapshot.forEach((i) => {
                            id2 = i.id;
                        });
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
                                        const filteredPlayers = playersSnapshot.docs.filter(
                                            (doc) => doc.data().idJugador === idJugador,
                                        );
                                        const valor = filteredPlayers[0].data().valor;
                                        return db
                                            .collection('LigasJuego')
                                            .doc(id)
                                            .collection('Jugadores')
                                            .doc(id2)
                                            .update({
                                                plantilla: FieldValue.arrayRemove(idJugador),
                                                presupuesto: FieldValue.increment(valor),
                                            })
                                            .then(() => {
                                                res.sendStatus(200);
                                            });
                                    });
                            });
                    });
            })
            .catch((error) => {
                return res.status(501).send({
                    err: 'Error al vender el jugador',
                    error: error.message,
                });
            });
    };
};
