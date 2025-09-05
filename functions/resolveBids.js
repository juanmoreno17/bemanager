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
                        const data = docSnapshot.data();
                        const dataDate = data?.fechaActualizacion;
                        const now = new Date();
                        const dayInMilliseconds = 24 * 60 * 60 * 1000;
                        if (data?.estado === 'abierta') {
                            return res.status(200).send({
                                message: 'La liga aún no ha comenzado',
                            });
                        }
                        return db
                            .collection('LigasJuego')
                            .doc(id)
                            .collection('Mercado')
                            .get()
                            .then((mercadoSnapshot) => {
                                if (mercadoSnapshot.empty) return;
                                if (now - dataDate.toDate() < dayInMilliseconds) return;
                                const filteredDocs = [];
                                mercadoSnapshot.forEach((doc) => {
                                    const data = doc.data();
                                    if (data.pujas) {
                                        filteredDocs.push(data);
                                    }
                                });
                                if (filteredDocs.length === 0) return;
                                console.log('Pujas encontradas:', filteredDocs.length);
                                filteredDocs.forEach((bid) => {
                                    const { idJugador, pujas } = bid;
                                    const highestBid = pujas.reduce((max, current) => {
                                        if (current.pujaActual > max.pujaActual) {
                                            return current;
                                        } else if (current.pujaActual === max.pujaActual) {
                                            return new Date(current.fechaPuja) <
                                                new Date(max.fechaPuja)
                                                ? current
                                                : max;
                                        }
                                        return max;
                                    }, pujas[0]);
                                    console.log('Puja más alta encontrada:', highestBid);
                                    const { idPujador, pujaActual } = highestBid;
                                    db.collection('LigasJuego')
                                        .doc(id)
                                        .collection('Jugadores')
                                        .where('idUsuario', '==', idPujador)
                                        .get()
                                        .then((querySnapshot) => {
                                            querySnapshot.forEach((doc) => {
                                                const jugadorData = doc.data();
                                                const plantilla = jugadorData.plantilla;
                                                const presupuesto = jugadorData.presupuesto;
                                                plantilla.push(idJugador);
                                                const nuevoPresupuesto = presupuesto - pujaActual;
                                                db.collection('LigasJuego')
                                                    .doc(id)
                                                    .collection('Jugadores')
                                                    .doc(doc.id)
                                                    .update({
                                                        plantilla,
                                                        presupuesto: nuevoPresupuesto,
                                                    });
                                            });
                                        });
                                });
                            });
                    });
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) => {
                console.error('Error al resolver las pujas:', error);
            });
    };
};
