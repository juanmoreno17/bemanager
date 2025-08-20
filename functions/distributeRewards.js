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
                                        return; // No actualizar si el idUsuario está en jugadoresSinPuntuar
                                    }

                                    let bonus = 0;

                                    // Asignar los bonos a los tres primeros
                                    if (index === 0) bonus += 20000000; // Primer lugar
                                    if (index === 1) bonus += 10000000; // Segundo lugar
                                    if (index === 2) bonus += 5000000; // Tercer lugar

                                    // Sumar el valor de puntuacion * 100.000
                                    bonus += gamePlayer.puntuacion * 100000;

                                    // Actualizar el presupuesto
                                    const nuevoPresupuesto = gamePlayer.presupuesto + bonus;

                                    // Actualizar en la base de datos
                                    db.collection('LigasJuego')
                                        .doc(id)
                                        .collection('Jugadores')
                                        .doc(gamePlayer.id)
                                        .update({ presupuesto: nuevoPresupuesto });
                                });
                            });
                    })
                    .then(() => {
                        // Eliminar el campo jugadoresSinPuntuar
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
