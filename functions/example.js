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
                return db
                    .collection(`Ligas`)
                    .doc(id)
                    .listCollections()
                    .then((subCollections) => {
                        subCollections.forEach((subCollection) => {
                            const data = [];
                            subCollection.get().then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    data.push(doc.data());
                                });
                                return res.status(200).send({ data });
                            });
                        });
                    });
            })
            .catch((error) =>
                res.status(501).send({ err: 'No se encontró un documento con ese idLiga', error }),
            );
    };
};

/*return db
    .collection('Ligas')
    .where('idLiga', '==', idLiga)
    .get()
    .then((querySnapshot) => {
        let id = 0;
        querySnapshot.forEach((i) => {
            id = i.id;
        });
     })*/

/*.get()
  .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
          data.push(doc.id);
      });
res.status(200).send({ data });*/

/*return db
  .collection(`Ligas`)
  .doc(id)
  .listCollections()
  .then((subCollections) => {
      subCollections.forEach((subCollection) => {
          const data = [];
          subCollection.get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  data.push(doc.data());
              });
              return res.status(200).send({ data });
          });
      });
  });*/
