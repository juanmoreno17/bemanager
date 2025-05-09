const uuid = require('uuid');

const data = [
    {
        idEquipo: uuid.v4(),
        nombre: 'Athletic Club',
        estadio: 'Estadio San Mamés',
        ciudad: 'Bilbao',
        fundacion: 1898,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905966/Equipos/wzmxnm3bkevfxg4luxio.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Atlético de Madrid',
        estadio: 'Civitas Metropolitano',
        ciudad: 'Madrid',
        fundacion: 1903,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/acelewga8llc5rtxyhm1.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'CA Osasuna',
        estadio: 'Estadio El Sadar',
        ciudad: 'Pamplona',
        fundacion: 1920,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'CD Leganés',
        estadio: 'Estadio Municipal Butarque',
        ciudad: 'Leganés',
        fundacion: 1928,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/jqmxqlphj3iwfjwhenep.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Deportivo Alavés',
        estadio: 'Mendizorroza',
        ciudad: 'Vitoria',
        fundacion: 1921,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/sqwotxs9eixv32obhctd.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'FC Barcelona',
        estadio: 'Estadi Olimpic Lluis Companys',
        ciudad: 'Barcelona',
        fundacion: 1899,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/cb78tdpbklc3q6ajyfkm.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Getafe CF',
        estadio: 'Coliseum',
        ciudad: 'Getafe',
        fundacion: 1983,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905967/Equipos/jw5httdtz1ylwbe8w75a.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Girona FC',
        estadio: 'Estadio Municipal de Montilivi',
        ciudad: 'Girona',
        fundacion: 1930,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/klob9sljnisoxepsfuor.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Rayo Vallecano',
        estadio: 'Estadio de Vallecas',
        ciudad: 'Madrid',
        fundacion: 1924,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/vfzk79delbtvafny0xse.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Celta de Vigo',
        estadio: 'Estadio ABANCA Balaídos',
        ciudad: 'Vigo',
        fundacion: 1923,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/wojoqwlghsob2iuadgc4.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'RCD Espanyol',
        estadio: 'RCDE Stadium',
        ciudad: 'Barcelona',
        fundacion: 1900,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/htn43noatdac8qznetoh.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'RCD Mallorca',
        estadio: 'Estadi Mallorca Son Moix',
        ciudad: 'Palma de Mallorca',
        fundacion: 1916,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/n5gtwpqzkljzs5raqzek.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Real Betis',
        estadio: 'Estadio Benito Villamarín',
        ciudad: 'Sevilla',
        fundacion: 1907,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/gvnhl2kzu262zbgttymu.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Real Madrid',
        estadio: 'Estadio Santiago Bernabéu',
        ciudad: 'Madrid',
        fundacion: 1902,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/zx4sht40zi4km3lkllip.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Real Sociedad',
        estadio: 'Reale Anoeta',
        ciudad: 'San Sebastián',
        fundacion: 1909,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905966/Equipos/o4r1qznsrt54y6sbqd78.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Real Valladolid',
        estadio: 'Estadio Municipal José Zorrilla',
        ciudad: 'Valladolid',
        fundacion: 1928,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905966/Equipos/kcw8gs8cul1cdpjkxfjt.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Sevilla FC',
        estadio: 'Ramón Sánchez-Pizjuán',
        ciudad: 'Sevilla',
        fundacion: 1905,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905966/Equipos/yha31ftv3p785tuy8o3a.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'UD Las Palmas',
        estadio: 'Estadio Gran Canaria',
        ciudad: 'Las Palmas',
        fundacion: 1949,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905966/Equipos/xmpqbosfnxvey6egmpgf.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Valencia CF',
        estadio: 'Camp de Mestalla',
        ciudad: 'Valencia',
        fundacion: 1919,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905966/Equipos/cpkwkkjvoyrpyzueuu1l.png',
    },
    {
        idEquipo: uuid.v4(),
        nombre: 'Villarreal CF',
        estadio: 'Estadio de la Cerámica',
        ciudad: 'Villarreal',
        fundacion: 1923,
        escudo: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905966/Equipos/icd8a15lbsvs2xvtkedv.png',
    },
];

exports.data = data;
