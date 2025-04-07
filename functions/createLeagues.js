const uuid = require('uuid');

module.exports = function (db) {
    return function (req, res) {
        const { pais } = req.body;
        if (!pais) return res.status(404).send({ err: 'No se ha enviado un Pais' });
        const league = {
            idLiga: uuid.v4(),
            pais,
        };
        return db
            .collection('Ligas')
            .doc()
            .set(league)
            .then(() => {
                return res.status(200).send({ data: league });
            })
            .catch((error) => res.status(501).send({ err: 'Algo salio mal', error }));
    };
};
