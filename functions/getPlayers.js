module.exports = function (db) {
    return function (req, res) {
        const { idLiga, idEquipo } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        if (!idEquipo) return res.status(404).send({ err: 'No se ha enviado un id de equipo' });
        return db
            .collection('Ligas')
            .where('idLiga', '==', idLiga)
            .get()
            .then((querySnapshot) => {
                let id = 0;
                querySnapshot.forEach((i) => {
                    id = i.id;
                });
                return db
                    .collection(`Ligas`)
                    .doc(id)
                    .collection('Equipos')
                    .where('idEquipo', '==', idEquipo)
                    .get()
                    .then((querySnapshot) => {
                        let id2 = 0;
                        querySnapshot.forEach((i) => {
                            id2 = i.id;
                        });
                        return db
                            .collection(`Ligas`)
                            .doc(id)
                            .collection('Equipos')
                            .doc(id2)
                            .collection('Jugadores')
                            .get()
                            .then((playersSnapshot) => {
                                const allPlayers = [];
                                playersSnapshot.forEach((i) => {
                                    allPlayers.push(i.data());
                                });
                                allPlayers.sort((a, b) => b.puntuacionTotal - a.puntuacionTotal);
                                return res.status(200).send({ data: allPlayers });
                            });
                    });
            })
            .catch((error) =>
                res.status(501).send({ err: 'No se encontró un documento con ese idLiga', error }),
            );
    };
};
