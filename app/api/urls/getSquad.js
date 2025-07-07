import { request } from '../base';

export const getSquad = (idLiga, idLigaJuego, idUsuario) =>
    request({ url: '/getSquad', method: 'POST', data: { idLiga, idLigaJuego, idUsuario } });
