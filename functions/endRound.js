module.exports = function (db) {
    return function (req, res) {
        const { idLiga } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un id de liga' });
        return db
            .collection('LigasJuego')
            .where('idLiga', '==', idLiga)
            .where('estado', '==', 'cerrada')
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    return res
                        .status(404)
                        .send({ err: 'No se encontró una liga cerrada con ese id' });
                }
                querySnapshot.forEach((doc) => {
                    const id = doc.id;
                    return db.collection('LigasJuego').doc(id).update({
                        estadoJornada: 'finalizada',
                    });
                });
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'Error al reiniciar los jugadores',
                    error: error.message,
                }),
            );
    };
};
