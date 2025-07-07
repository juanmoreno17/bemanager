import { request } from '../base';

export const distributeRewards = (idLigaJuego) =>
    request({ url: '/distributeRewards', method: 'POST', data: { idLigaJuego } });
