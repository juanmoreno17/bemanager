const uuid = require('uuid');
//const client = require('./twilio');

module.exports = function (db) {
    return function (req, res) {
        const { idLiga, nombre, idUsuario, nombreUsuario } = req.body;
        if (!idLiga) return res.status(404).send({ err: 'No se ha enviado un idLiga' });
        if (!nombre) return res.status(404).send({ err: 'No se ha enviado un Nombre' });
        if (!idUsuario) return res.status(404).send({ err: 'No se ha enviado un idUsuario' });
        //if (!phoneNumber) return res.status(404).send({ err: 'No se ha enviado un phoneNumber' });
        if (!nombreUsuario)
            return res.status(404).send({ err: 'No se ha enviado un nombre de usuario' });
        /*const letters = '0123456789ABCDEF';
        const codLiga = Array.from(
            { length: 6 },
            () => letters[Math.floor(Math.random() * letters.length)],
        ).join('');*/
        const league = {
            idLigaJuego: uuid.v4(),
            idLiga,
            nombre,
            propietario: idUsuario,
            estado: 'abierta',
        };
        const player = {
            idLigaJuego: league.idLigaJuego,
            idUsuario,
            nombreUsuario,
            presupuesto: 0,
            puntuacion: 0,
            puntuacionTotal: 0,
        };
        return db
            .collection('LigasJuego')
            .doc()
            .set(league)
            .then(() => {
                return db
                    .collection('LigasJuego')
                    .where('idLigaJuego', '==', league.idLigaJuego)
                    .get()
                    .then((querySnapshot) => {
                        let id = 0;
                        querySnapshot.forEach((i) => {
                            id = i.id;
                        });
                        return db
                            .collection(`LigasJuego/${id}/Jugadores`)
                            .doc()
                            .set(player)
                            .then(() => {
                                return res.status(200).send({ data: league });
                            })
                            .catch((error) => {
                                return res
                                    .status(501)
                                    .send({ err: 'No se pudo actualizar la base de datos', error });
                            });
                    })
                    .catch((error) => res.status(501).send({ err: 'Algo salio mal', error }));
            })
            .catch((error) => res.status(501).send({ err: 'Algo salio mal', error }));
    };
};

/*return client.messages
    .create({
        body: `El código para entrar en tu liga es ${codLiga}`,
        from: '+14155238886',
        to: phoneNumber,
    })
    .then(() => res.status(200).send({ data: league }))
    .catch((error) => {
        console.error('Error al enviar el mensaje:', error);
    });*/

//res.status(200).send({ data: league })
