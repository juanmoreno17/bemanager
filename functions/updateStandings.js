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
                        if (data?.estado === 'abierta') {
                            return res.status(200).send({
                                message: 'La liga aún no ha comenzado',
                            });
                        }
                        if (!data.estadoJornada || data.estadoJornada === 'en curso') {
                            return res.status(200).send({
                                message: 'La jornada no ha comenzado o está en curso',
                            });
                        }
                        if (
                            data.clasificacionActualizada === undefined ||
                            data.clasificacionActualizada === true
                        ) {
                            return res.status(200).send({
                                message: 'La clasificación ya ha sido actualizada',
                            });
                        }
                        return db
                            .collection('LigasJuego')
                            .doc(id)
                            .collection('Jugadores')
                            .get()
                            .then((querySnapshot) => {
                                let gamePlayers = [];
                                querySnapshot.forEach((i) =>
                                    gamePlayers.push({ id: i.id, ...i.data() }),
                                );
                                // Obtener los jugadores de example3
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
                                                playersSnapshot.forEach((playerDoc) => {
                                                    allPlayers.push(playerDoc.data());
                                                });
                                                gamePlayers.forEach((gamePlayer) => {
                                                    const { plantilla, presupuesto } = gamePlayer;

                                                    if (presupuesto > 0) {
                                                        let puntuacion = 0;

                                                        // Sumar las puntuaciones de los jugadores que coincidan con la plantilla
                                                        plantilla.forEach((playerId) => {
                                                            const matchingPlayer = allPlayers.find(
                                                                (player) =>
                                                                    player.idJugador === playerId,
                                                            );
                                                            if (matchingPlayer) {
                                                                puntuacion +=
                                                                    matchingPlayer.puntuacion || 0; // Sumar el campo 'puntuacion'
                                                            }
                                                        });

                                                        // Actualizar los campos puntuacion y puntuacionTotal
                                                        const puntuacionTotal =
                                                            (gamePlayer.puntuacionTotal || 0) +
                                                            puntuacion;

                                                        db.collection('LigasJuego')
                                                            .doc(id)
                                                            .collection('Jugadores')
                                                            .doc(gamePlayer.id)
                                                            .update({
                                                                puntuacion,
                                                                puntuacionTotal,
                                                            });
                                                    }
                                                });
                                                return db
                                                    .collection('LigasJuego')
                                                    .doc(id)
                                                    .update({ clasificacionActualizada: true })
                                                    .then(() => {
                                                        res.sendStatus(200);
                                                    });
                                            });
                                    });
                            });
                    });
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'Error al actualizar la clasificación',
                    error: error.message,
                }),
            );
    };
};
