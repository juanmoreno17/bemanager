module.exports = function (db) {
    return function (req, res) {
        return db
            .collection('LigasJuego')
            .get()
            .then((querySnapshot) => {
                const data = [];
                querySnapshot.forEach((i) => {
                    data.push(i.data());
                });
                return res.status(200).send({ data });
            })
            .catch((error) => res.status(501).send({ err: 'No se encontraron documentos', error }));
    };
};
