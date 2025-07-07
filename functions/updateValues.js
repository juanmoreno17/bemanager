const { FieldPath } = require('firebase-admin/firestore');
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
                const leagueRef = db.collection('Ligas').doc(id);
                return db
                    .collectionGroup('Jugadores')
                    .orderBy(FieldPath.documentId())
                    .startAt(leagueRef.path)
                    .endAt(leagueRef.path + '\uf8ff')
                    .get()
                    .then((querySnapshot) => {
                        const batch = db.batch();
                        querySnapshot.forEach((doc) => {
                            const jugadorRef = doc.ref;
                            const jugadorData = doc.data();
                            let nuevoValor = jugadorData.valor;

                            // Actualizar el valor según la puntuación
                            if (jugadorData.puntuacion >= 0 && jugadorData.puntuacion <= 5.9) {
                                nuevoValor *= 0.8; // Disminuir 20%
                            } else if (
                                jugadorData.puntuacion >= 6 &&
                                jugadorData.puntuacion <= 6.4
                            ) {
                                nuevoValor *= 0.9; // Disminuir 10%
                            } else if (
                                jugadorData.puntuacion >= 7 &&
                                jugadorData.puntuacion <= 7.9
                            ) {
                                nuevoValor *= 1.1; // Aumentar 10%
                            } else if (
                                jugadorData.puntuacion >= 8 &&
                                jugadorData.puntuacion <= 8.9
                            ) {
                                nuevoValor *= 1.2; // Aumentar 20%
                            } else if (
                                jugadorData.puntuacion >= 9 &&
                                jugadorData.puntuacion <= 10
                            ) {
                                nuevoValor *= 1.3; // Aumentar 30%
                            }

                            // Asegurarse de que el valor no sea menor a 100,000
                            if (nuevoValor < 100000) {
                                nuevoValor = 100000;
                            }

                            // Actualizar el valor del jugador
                            batch.update(jugadorRef, { valor: nuevoValor });
                        });
                        return batch.commit();
                    })
                    .then(() => {
                        return res.status(200).send({
                            message:
                                'Los valores de los jugadores han sido actualizados correctamente',
                        });
                    });
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'Error al actualizar los valores de los jugadores',
                    error: error.message,
                }),
            );
    };
};
