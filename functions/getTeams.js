module.exports = function (db) {
    return function (req, res) {
        const { idLiga } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
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
                    .orderBy('nombre')
                    .get()
                    .then((querySnapshot) => {
                        const data = [];
                        querySnapshot.forEach((i) => data.push(i.data()));
                        return res.status(200).send({ data });
                    })
                    .catch((error) =>
                        res.status(501).send({ err: 'No se encontraron documentos', error }),
                    );
            })
            .catch((error) =>
                res.status(501).send({ err: 'No se encontró un documento con ese idLiga', error }),
            );
    };
};
