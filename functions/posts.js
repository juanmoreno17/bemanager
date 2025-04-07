const uuid = require('uuid');

module.exports = function (db) {
    return function (req, res) {
        if (req.method === 'GET') {
            return db
                .collection('posts')
                .get()
                .then((querySnapshot) => {
                    const data = [];
                    querySnapshot.forEach((i) => data.push(i.data()));

                    return res.status(200).send({ data });
                })
                .catch((error) => res.status(501).send({ err: 'Algo salio mal', error }));
        }
        if (req.method === 'POST') {
            const { title, content, image, uid } = req.body;
            if (!title) return res.status(404).send({ err: 'No se ha enviado un titulo' });
            if (!content) return res.status(404).send({ err: 'No se ha enviado un contenido' });
            if (!image) return res.status(404).send({ err: 'No se ha enviado una imagen' });
            if (!uid) return res.status(404).send({ err: 'No se ha enviado un identificador' });
            const post = {
                title,
                content,
                image,
                uid,
                uuid: uuid.v4(),
            };
            return db
                .collection('posts')
                .doc()
                .set(post)
                .then(() => {
                    return res.status(200).send({ data: post });
                })
                .catch((error) => res.status(501).send({ err: 'Algo salio mal', error }));
        }
    };
};
