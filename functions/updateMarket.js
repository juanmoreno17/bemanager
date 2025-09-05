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
                    .then((docSnapshot) => {
                        const data = docSnapshot.data();
                        const dataDate = data?.fechaActualizacion;

                        if (dataDate) {
                            const date = dataDate.toDate();
                            const dayInMiliseconds = 24 * 60 * 60 * 1000;
                            const now = new Date();

                            if (now - date < dayInMiliseconds) {
                                return res.status(200).send({
                                    message: 'No es necesario actualizar el mercado todavía',
                                });
                            }
                        }
                        return db
                            .collection('LigasJuego')
                            .doc(id)
                            .collection('Mercado')
                            .get()
                            .then((mercadoSnapshot) => {
                                if (!mercadoSnapshot.empty) {
                                    const deletePromises = [];
                                    mercadoSnapshot.forEach((doc) => {
                                        deletePromises.push(
                                            db
                                                .collection('LigasJuego')
                                                .doc(id)
                                                .collection('Mercado')
                                                .doc(doc.id)
                                                .delete(),
                                        );
                                    });
                                    return Promise.all(deletePromises);
                                }
                            })
                            .then(() => {
                                return db
                                    .collection('LigasJuego')
                                    .doc(id)
                                    .collection('Jugadores')
                                    .get()
                                    .then((querySnapshot) => {
                                        const squadPlayersIds = [];
                                        querySnapshot.forEach((i) => {
                                            const data = i.data();
                                            if (data.plantilla) {
                                                squadPlayersIds.push(...data.plantilla);
                                            }
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
                                                        const filteredPlayers =
                                                            playersSnapshot.docs.filter((doc) => {
                                                                const data = doc.data();
                                                                return !squadPlayersIds.includes(
                                                                    data.idJugador,
                                                                );
                                                            });
                                                        while (
                                                            allPlayers.length < 20 &&
                                                            filteredPlayers.length > 0
                                                        ) {
                                                            const randomIndex = Math.floor(
                                                                Math.random() *
                                                                    filteredPlayers.length,
                                                            );
                                                            allPlayers.push(
                                                                filteredPlayers[randomIndex].data(),
                                                            );
                                                            filteredPlayers.splice(randomIndex, 1);
                                                        }
                                                        const colecRef = db
                                                            .collection('LigasJuego')
                                                            .doc(id)
                                                            .collection('Mercado');
                                                        allPlayers.forEach((player) => {
                                                            colecRef
                                                                .doc()
                                                                .set({
                                                                    idJugador: player.idJugador,
                                                                })
                                                                .then(() => {
                                                                    const currentDate = new Date();
                                                                    return db
                                                                        .collection('LigasJuego')
                                                                        .doc(id)
                                                                        .update({
                                                                            fechaActualizacion:
                                                                                currentDate,
                                                                        });
                                                                });
                                                        });
                                                    })
                                                    .then(() => {
                                                        res.sendStatus(200);
                                                    });
                                            });
                                    });
                            });
                    });
            })
            .catch((error) => {
                return res.status(501).send({
                    err: 'No se pudo actualizar el mercado de jugadores',
                    error,
                });
            });
    };
};
