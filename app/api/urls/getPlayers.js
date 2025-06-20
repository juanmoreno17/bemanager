import { request } from '../base';

export const getPlayers = (idLiga, lastVisible) =>
    request({ url: '/getPlayers', method: 'POST', data: { idLiga, lastVisible } });
