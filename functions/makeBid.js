module.exports = function (db) {
    return function (req, res) {
        const { idLigaJuego, idJugador, idPujador, bidValue } = req.body;
        if (!idLigaJuego)
            return res.status(404).send({ err: 'No se ha enviado un id de liga del juego' });
        if (!idJugador) return res.status(404).send({ err: 'No se ha enviado un id de jugador' });
        if (!idPujador) return res.status(404).send({ err: 'No se ha enviado un id de pujador' });
        if (!bidValue) return res.status(404).send({ err: 'No se ha enviado una puja' });
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
                    .collection('Mercado')
                    .where('idJugador', '==', idJugador)
                    .get()
                    .then((querySnapshot) => {
                        let id2 = 0;
                        querySnapshot.forEach((i) => {
                            id2 = i.id;
                        });
                        return db
                            .collection('LigasJuego')
                            .doc(id)
                            .collection('Mercado')
                            .doc(id2)
                            .get()
                            .then((doc) => {
                                const data = doc.data();
                                const now = new Date();
                                if (data.pujas?.some((puja) => puja.idPujador === idPujador))
                                    return res.status(200).send({
                                        message: 'Ya has realizado una puja por este jugador',
                                    });
                                return db
                                    .collection('LigasJuego')
                                    .doc(id)
                                    .collection('Mercado')
                                    .doc(id2)
                                    .update({
                                        pujas: [
                                            ...(data.pujas || []),
                                            {
                                                idPujador,
                                                pujaActual: bidValue,
                                                fechaPuja: now,
                                            },
                                        ],
                                    })
                                    .then(() => {
                                        res.sendStatus(200);
                                    });
                            });
                    });
            })
            .catch((error) => {
                return res.status(501).send({
                    err: 'Error al realizar la puja',
                    error: error.message,
                });
            });
    };
};
