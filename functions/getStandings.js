module.exports = function (db) {
    return function (req, res) {
        const { idLigaJuego, orderFlag } = req.body;
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
                if (orderFlag === 'parcial') {
                    return db
                        .collection(`LigasJuego`)
                        .doc(id)
                        .collection('Jugadores')
                        .orderBy('puntuacion', 'desc')
                        .get()
                        .then((querySnapshot) => {
                            const data = [];
                            querySnapshot.forEach((i) => data.push(i.data()));
                            return res.status(200).send({ data });
                        })
                        .catch((error) =>
                            res.status(501).send({ err: 'No se encontraron documentos', error }),
                        );
                } else {
                    return db
                        .collection(`LigasJuego`)
                        .doc(id)
                        .collection('Jugadores')
                        .orderBy('puntuacionTotal', 'desc')
                        .get()
                        .then((querySnapshot) => {
                            const data = [];
                            querySnapshot.forEach((i) => data.push(i.data()));
                            return res.status(200).send({ data });
                        })
                        .catch((error) =>
                            res.status(501).send({ err: 'No se encontraron documentos', error }),
                        );
                }
            })
            .catch((error) =>
                res.status(501).send({ err: 'No se encontró un documento con ese idLiga', error }),
            );
    };
};
