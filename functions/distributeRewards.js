const { FieldValue } = require('firebase-admin/firestore');
module.exports = function (db) {
    return function (req, res) {
        const { idLigaJuego } = req.body;
        if (!idLigaJuego)
            return res.status(404).send({ err: 'No se ha enviado un id de liga del juego' });
        return db
            .collection('LigasJuego')
            .where('idLigaJuego', '==', idLigaJuego)
            .get()
            .then((querySnapshot) => {
                let id = 0;
                querySnapshot.forEach((i) => {
                    id = i.id;
                });
                return db
                    .collection('LigasJuego')
                    .doc(id)
                    .get()
                    .then((docSnapshot) => {
                        const jugadoresSinPuntuar = docSnapshot.data()?.jugadoresSinPuntuar || [];
                        return db
                            .collection('LigasJuego')
                            .doc(id)
                            .collection('Jugadores')
                            .get()
                            .then((querySnapshot) => {
                                let gamePlayers = [];
                                querySnapshot.forEach((i) =>
                                    gamePlayers.push({ id: i.id, ...i.data() }),
                                );
                                gamePlayers.sort((a, b) => b.puntuacion - a.puntuacion);
                                gamePlayers.forEach((gamePlayer, index) => {
                                    if (jugadoresSinPuntuar.includes(gamePlayer.idUsuario)) {
                                        return;
                                    }
                                    let bonus = 0;
                                    if (index === 0) bonus += 20000000;
                                    if (index === 1) bonus += 10000000;
                                    if (index === 2) bonus += 5000000;
                                    bonus += gamePlayer.puntuacion * 100000;
                                    const nuevoPresupuesto = gamePlayer.presupuesto + bonus;
                                    db.collection('LigasJuego')
                                        .doc(id)
                                        .collection('Jugadores')
                                        .doc(gamePlayer.id)
                                        .update({ presupuesto: nuevoPresupuesto });
                                });
                            });
                    })
                    .then(() => {
                        return db.collection('LigasJuego').doc(id).update({
                            jugadoresSinPuntuar: FieldValue.delete(),
                        });
                    })
                    .then(() => {
                        res.sendStatus(200);
                    });
            })
            .catch((error) =>
                res.status(501).send({
                    err: 'Error al actualizar la clasificación',
                    error: error.message,
                }),
            );
    };
};
