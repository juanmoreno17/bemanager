module.exports = function (db) {
    return function (req, res) {
        //const { idUsuario } = req.body;
        //if (!idUsuario) return res.status(404).send({ err: 'No se ha enviado un identificador' });

        return (
            db
                .collection('LigasJuego')
                //.where('jugadores', 'array-contains', idUsuario)
                .get()
                .then((querySnapshot) => {
                    const data = [];
                    querySnapshot.forEach((i) => {
                        data.push(i.data());
                    });
                    return res.status(200).send({ data });
                })
                .catch((error) =>
                    res.status(501).send({ err: 'No se encontraron documentos', error }),
                )
        );
    };
};
