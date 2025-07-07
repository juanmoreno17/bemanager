module.exports = function (db) {
    return function (req, res) {
        const { idLigaJuego, idUsuario } = req.body;
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
                                const data = docSnapshot.data();
                                const budget = data?.presupuesto || 0;
                                return res.status(200).send({
                                    data: budget,
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
