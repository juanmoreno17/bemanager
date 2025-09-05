const { data } = require('./players');

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
                    .collection(`Ligas/${id}/Equipos`)
                    .where('idEquipo', '==', idEquipo)
                    .get()
                    .then((querySnapshot) => {
                        let id_2 = 0;
                        querySnapshot.forEach((i) => {
                            id_2 = i.id;
                        });
                        const colecRef = db.collection(`Ligas/${id}/Equipos/${id_2}/Jugadores`);
                        data.forEach((i) => {
                            return colecRef
                                .doc()
                                .set(i)
                                .then(() => {
                                    return res.status(200).send({
                                        data: { message: 'Se actualizó la base de datos' },
                                    });
                                })
                                .catch((error) => {
                                    return res.status(501).send({
                                        err: 'No se pudo actualizar la base de datos',
                                        error,
                                    });
                                });
                        });
                    })
                    .catch((error) =>
                        res
                            .status(501)
                            .send({ err: 'No se encontró un documento con ese idEquipo', error }),
                    );
            })
            .catch((error) =>
                res.status(501).send({ err: 'No se encontró un documento con ese idLiga', error }),
            );
    };
};
