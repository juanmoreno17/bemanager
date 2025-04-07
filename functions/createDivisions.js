const uuid = require('uuid');

module.exports = function (db) {
    return function (req, res) {
        const { idLiga, nombre } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        if (!nombre) return res.status(404).send({ err: 'No se ha enviado un nombre de division' });
        const division = {
            idDivision: uuid.v4(),
            nombre,
        };
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
                    .collection(`Ligas/${id}/Divisiones`)
                    .doc()
                    .set(division)
                    .then(() => {
                        return res.status(200).send({ data: division });
                    })
                    .catch((error) => res.status(501).send({ err: 'Algo salio mal', error }));
            })
            .catch((error) =>
                res.status(501).send({ err: 'No se encontró un documento con ese idLiga', error }),
            );
    };
};
