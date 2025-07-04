const uuid = require('uuid');

const data = [
    {
        idJugador: uuid.v4(),
        nombre: 'Sergio Herrera',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596198/Jugadores/Osasuna/herrera_ggvbux.png',
        posicion: 'Portero',
        valor: '4.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Aitor Fernández',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596197/Jugadores/Osasuna/aitor_gnb3hc.png',
        posicion: 'Portero',
        valor: '1.500.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Enzo Boyomo',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596196/Jugadores/Osasuna/boyomo_s31zgy.png',
        posicion: 'Defensa',
        valor: '20.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Jorge Herrando',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596196/Jugadores/Osasuna/herrando_xs8ofh.png',
        posicion: 'Defensa',
        valor: '4.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Alejandro Catena',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596195/Jugadores/Osasuna/catena_wsxojv.png',
        posicion: 'Defensa',
        valor: '4.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Unai García',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596194/Jugadores/Osasuna/unaigar_e3rg60.png',
        posicion: 'Defensa',
        valor: '1.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Abel Bretones',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596194/Jugadores/Osasuna/bretones_m3s26u.png',
        posicion: 'Defensa',
        valor: '3.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Juan Cruz',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596193/Jugadores/Osasuna/juancruz_qvkohc.png',
        posicion: 'Defensa',
        valor: '1.800.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Jesús Areso',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596193/Jugadores/Osasuna/areso_dukbip.png',
        posicion: 'Defensa',
        valor: '8.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Rubén Peña',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596192/Jugadores/Osasuna/pe%C3%B1a_xns7k0.png',
        posicion: 'Defensa',
        valor: '1.800.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Lucas Torró',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596191/Jugadores/Osasuna/torro_awppys.png',
        posicion: 'Mediocampista',
        valor: '3.500.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Iker Muñoz',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596190/Jugadores/Osasuna/ikermu%C3%B1oz_p2veii.png',
        posicion: 'Mediocampista',
        valor: '3.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Jon Moncayola',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596191/Jugadores/Osasuna/monca_bfhdki.png',
        posicion: 'Mediocampista',
        valor: '7.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Pablo Ibáñez',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596190/Jugadores/Osasuna/iba%C3%B1ez_r8wxze.png',
        posicion: 'Mediocampista',
        valor: '2.300.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Aimar Oroz',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596189/Jugadores/Osasuna/oroz_yetlff.png',
        posicion: 'Mediocampista',
        valor: '15.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Bryan Zaragoza',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596189/Jugadores/Osasuna/bryanzara_sqtvik.png',
        posicion: 'Delantero',
        valor: '12.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Moi Gómez',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596188/Jugadores/Osasuna/moi_sy5d5y.png',
        posicion: 'Delantero',
        valor: '3.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'José Manuel Arnáiz',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596201/Jugadores/Osasuna/arnaiz_lbjag8.png',
        posicion: 'Delantero',
        valor: '1.800.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Ruben García',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596201/Jugadores/Osasuna/ruben_b6z6pa.png',
        posicion: 'Delantero',
        valor: '2.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Kike Barja',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596200/Jugadores/Osasuna/barja_kt74jn.png',
        posicion: 'Delantero',
        valor: '1.800.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Ante Budimir',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596199/Jugadores/Osasuna/ante_lhgo6w.png',
        posicion: 'Delantero',
        valor: '5.000.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
    {
        idJugador: uuid.v4(),
        nombre: 'Raúl García',
        foto: 'https://res.cloudinary.com/daskrmb6s/image/upload/v1743596198/Jugadores/Osasuna/raulgar_ww5fp1.png',
        posicion: 'Delantero',
        valor: '3.500.000 €',
        puntuacion: 0,
        estado: 'Disponible',
        escudoEquipo:
            'https://res.cloudinary.com/daskrmb6s/image/upload/v1741905965/Equipos/ucqtmqwgm8cfxxqgqdvl.png',
    },
];

exports.data = data;
