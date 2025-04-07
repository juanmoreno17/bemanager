const { getAuth } = require('firebase-admin/auth');

module.exports = function (req, res) {
    //res.status(200).send(req.body);
    const { email, phoneNumber, password, displayName, photoURL } = req.body;
    // validar campos
    if (!email) return res.status(404).send({ err: 'No se ha enviado un email' });
    if (!phoneNumber) return res.status(404).send({ err: 'No se ha enviado un phoneNumber' });
    if (!password) return res.status(404).send({ err: 'No se ha enviado un password' });
    if (!displayName) return res.status(404).send({ err: 'No se ha enviado un displayName' });
    // crear el usuario
    getAuth()
        .createUser({
            email,
            phoneNumber,
            password,
            displayName,
            emailVerified: false,
            photoURL: photoURL || 'https://www.example.com/12345678/photo.png',
            disabled: false,
        })
        .then((usr) => res.status(200).send(usr))
        .catch((error) => res.status(501).send({ err: 'Algo salio mal', error }));
    // retorno de informacion
};
