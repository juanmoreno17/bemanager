import { request } from '../base';

export const getMyGameLeagues = (idUsuario) =>
    request({ url: '/getMyGameLeagues', method: 'POST', data: { idUsuario } });
