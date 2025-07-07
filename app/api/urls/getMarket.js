import { request } from '../base';

export const getMarket = (idLiga, idLigaJuego) =>
    request({ url: '/getMarket', method: 'POST', data: { idLiga, idLigaJuego } });
