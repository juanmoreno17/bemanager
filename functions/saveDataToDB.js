const { data } = require('./players');

module.exports = function (db) {
    return function (req, res) {
        const { idLiga, idDivision, idEquipo } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        if (!idDivision) return res.status(404).send({ err: 'No se ha enviado un id de division' });
        if (!idEquipo) return res.status(404).send({ err: 'No se ha enviado un id de equipo' });
        return db
            .collection('Ligas')
            .where('idLiga', '==', idLiga)
            .get()
            .then((querySnapshot) => {
                let id_1 = 0;
                querySnapshot.forEach((i) => {
                    id_1 = i.id;
                });
                return db
                    .collection(`Ligas/${id_1}/Divisiones`)
                    .where('idDivision', '==', idDivision)
                    .get()
                    .then((querySnapshot) => {
                        let id_2 = 0;
                        querySnapshot.forEach((i) => {
                            id_2 = i.id;
                        });
                        return db
                            .collection(`Ligas/${id_1}/Divisiones/${id_2}/Equipos`)
                            .where('idEquipo', '==', idEquipo)
                            .get()
                            .then((querySnapshot) => {
                                let id_3 = 0;
                                querySnapshot.forEach((i) => {
                                    id_3 = i.id;
                                });
                                const colecRef = db.collection(
                                    `Ligas/${id_1}/Divisiones/${id_2}/Equipos/${id_3}/Jugadores`,
                                );
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
                                res.status(501).send({
                                    err: 'No se encontró un documento con ese idEquipo',
                                    error,
                                }),
                            );
                    })
                    .catch((error) =>
                        res
                            .status(501)
                            .send({ err: 'No se encontró un documento con ese idDivision', error }),
                    );
            })
            .catch((error) =>
                res.status(501).send({ err: 'No se encontró un documento con ese idPais', error }),
            );
        /*const colecRef = db.collection(`/Ligas/${idLiga}/Divisiones/${idDivision}/Equipos`);

        data.forEach((i) => {
            colecRef
                .add(i)
                .then((doc) => {
                    console.log('Document written with ID: ', doc.id);
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });
        });*/
    };
};

/*const colecRef = db.collection(
    '/Ligas/7zEBRvKgL0312o6AaaIt/Divisiones/b3JEETFk4crwgRlbRY8o/Equipos',
);

data.forEach((i) => {
    colecRef
        .add(i)
        .then((doc) => {
            console.log('Document written with ID: ', doc.id);
        })
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
});*/
