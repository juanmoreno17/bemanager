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
                        if (data?.estado !== 'abierta') {
                            return res.status(200).send({
                                message: 'La liga ya se encuentra en curso',
                            });
                        }
                        return db
                            .collection('LigasJuego')
                            .doc(id)
                            .update({
                                estado: 'cerrada',
                            })
                            .then(() => {
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
                                        gamePlayers = gamePlayers.sort(() => 0.5 - Math.random());
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
                                                        const usedPlayers = new Set(); // Almacena los jugadores ya seleccionados
                                                        const updatePromises = gamePlayers.map(
                                                            (gamePlayer) => {
                                                                // Filtrar y seleccionar jugadores excluyendo los ya usados
                                                                const porteros = allPlayers.filter(
                                                                    (player) =>
                                                                        player.posicion ===
                                                                            'Portero' &&
                                                                        !usedPlayers.has(
                                                                            player.idJugador,
                                                                        ),
                                                                );
                                                                const defensas = allPlayers.filter(
                                                                    (player) =>
                                                                        player.posicion ===
                                                                            'Defensa' &&
                                                                        !usedPlayers.has(
                                                                            player.idJugador,
                                                                        ),
                                                                );
                                                                const mediocampistas =
                                                                    allPlayers.filter(
                                                                        (player) =>
                                                                            player.posicion ===
                                                                                'Mediocampista' &&
                                                                            !usedPlayers.has(
                                                                                player.idJugador,
                                                                            ),
                                                                    );
                                                                const delanteros =
                                                                    allPlayers.filter(
                                                                        (player) =>
                                                                            player.posicion ===
                                                                                'Delantero' &&
                                                                            !usedPlayers.has(
                                                                                player.idJugador,
                                                                            ),
                                                                    );
                                                                const selectRandom = (
                                                                    players,
                                                                    count,
                                                                ) =>
                                                                    players
                                                                        .sort(
                                                                            () =>
                                                                                0.5 - Math.random(),
                                                                        )
                                                                        .slice(0, count);
                                                                const selectedPorteros =
                                                                    selectRandom(porteros, 2);
                                                                const selectedDefensas =
                                                                    selectRandom(defensas, 6);
                                                                const selectedMediocampistas =
                                                                    selectRandom(mediocampistas, 4);
                                                                const selectedDelanteros =
                                                                    selectRandom(delanteros, 4);
                                                                const selectedPlayers = [
                                                                    ...selectedPorteros,
                                                                    ...selectedDefensas,
                                                                    ...selectedMediocampistas,
                                                                    ...selectedDelanteros,
                                                                ];
                                                                const totalValue =
                                                                    selectedPlayers.reduce(
                                                                        (sum, player) =>
                                                                            sum +
                                                                            (player.valor || 0),
                                                                        0,
                                                                    );
                                                                const bugetUpdated =
                                                                    300000000 - totalValue;
                                                                const jugadoresIds =
                                                                    selectedPlayers.map(
                                                                        (player) =>
                                                                            player.idJugador,
                                                                    );
                                                                // Marcar los jugadores seleccionados como usados
                                                                jugadoresIds.forEach((id) =>
                                                                    usedPlayers.add(id),
                                                                );
                                                                // Actualizar el documento del jugador con una plantilla única
                                                                return db
                                                                    .collection('LigasJuego')
                                                                    .doc(id)
                                                                    .collection('Jugadores')
                                                                    .doc(gamePlayer.id)
                                                                    .update({
                                                                        plantilla: jugadoresIds,
                                                                        presupuesto: bugetUpdated,
                                                                    });
                                                            },
                                                        );
                                                        return Promise.all(updatePromises).then(
                                                            () => {},
                                                        );
                                                    })
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
                    err: 'Error al comenzar la liga',
                    error: error.message,
                }),
            );
    };
};
