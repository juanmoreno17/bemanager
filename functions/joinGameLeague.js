const { FieldValue } = require('firebase-admin/firestore');

module.exports = function (db) {
    return function (req, res) {
        const { codLiga, idUsuario, nombreUsuario, photoURL } = req.body;
        if (!codLiga) return res.status(404).send({ err: 'No se ha enviado un codLiga' });
        if (!idUsuario) return res.status(404).send({ err: 'No se ha enviado un idUsuario' });
        if (!photoURL) return res.status(404).send({ err: 'No se ha enviado un photoURL' });
        if (!nombreUsuario)
            return res.status(404).send({ err: 'No se ha enviado un nombre de usuario' });
        const player = {
            idUsuario,
            nombreUsuario,
            photoURL,
            presupuesto: 0,
            puntuacion: 0,
            puntuacionTotal: 0,
        };
        return db
            .collection('LigasJuego')
            .where('codLiga', '==', codLiga)
            .get()
            .then((querySnapshot) => {
                let id = 0;
                querySnapshot.forEach((i) => {
                    id = i.id;
                });
                return db
                    .collection('LigasJuego')
                    .doc(id)
                    .update({
                        jugadores: FieldValue.arrayUnion(player.idUsuario),
                    })
                    .then(() => {
                        return db
                            .collection(`LigasJuego/${id}/Jugadores`)
                            .doc()
                            .set(player)
                            .then(() => {
                                return db
                                    .collection('LigasJuego')
                                    .where('codLiga', '==', codLiga)
                                    .get()
                                    .then((querySnapshot) => {
                                        let league = {};
                                        querySnapshot.forEach((i) => (league = i.data()));
                                        return res.status(200).send({ data: league });
                                    })
                                    .catch((error) => {
                                        return res.status(501).send({
                                            err: 'No se pudo obtener la liga',
                                            error: error.message,
                                        });
                                    });
                            })
                            .catch((error) => {
                                return res.status(501).send({
                                    err: 'No se pudo actualizar la base de datos',
                                    error: error.message,
                                });
                            });
                    })
                    .catch((error) => {
                        return res.status(501).send({
                            err: 'No se pudo actualizar el array jugadores',
                            error: error.message,
                        });
                    });
            })
            .catch((error) =>
                res
                    .status(501)
                    .send({ err: 'El código no pertenece a ninguna liga', error: error.message }),
            );
    };
};
