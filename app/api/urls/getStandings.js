import { request } from '../base';

export const getStandings = (idLigaJuego, orderFlag) =>
    request({ url: '/getStandings', method: 'POST', data: { idLigaJuego, orderFlag } });
