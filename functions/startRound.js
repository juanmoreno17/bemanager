const { FieldPath } = require('firebase-admin/firestore');
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
                    return db
                        .collection('LigasJuego')
                        .doc(id)
                        .collection('Jugadores')
                        .get()
                        .then((querySnapshot) => {
                            const batch = db.batch();
                            querySnapshot.forEach((doc) => {
                                const jugadorRef = doc.ref;
                                batch.update(jugadorRef, { puntuacion: 0 }); // Actualiza el campo puntuacion
                            });
                            return batch.commit(); // Ejecuta las actualizaciones en lote
                        })
                        .then(() => {
                            return db
                                .collection('LigasJuego')
                                .doc(id)
                                .collection('Jugadores')
                                .where('presupuesto', '<', 0)
                                .get()
                                .then((querySnapshot) => {
                                    const jugadoresSinPuntuar = [];
                                    querySnapshot.forEach((doc) => {
                                        jugadoresSinPuntuar.push(doc.data().idUsuario);
                                    });
                                    return db.collection('LigasJuego').doc(id).update({
                                        estadoJornada: 'en curso',
                                        clasificacionActualizada: false,
                                        jugadoresSinPuntuar,
                                    });
                                });
                        });
                });
                return db
                    .collection('Ligas')
                    .where('idLiga', '==', idLiga)
                    .get()
                    .then((querySnapshot) => {
                        let id2 = 0;
                        querySnapshot.forEach((i) => {
                            id2 = i.id;
                        });
                        const leagueRef = db.collection('Ligas').doc(id2);
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
                                    batch.update(jugadorRef, { puntuacion: 0 });
                                });
                                return batch.commit();
                            })
                            .then(() => {
                                return res.status(200).send({
                                    message:
                                        'La jornada ha comenzado y los jugadores han sido reiniciados',
                                });
                            });
                    });
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'Error al reiniciar los jugadores',
                    error: error.message,
                }),
            );
    };
};
