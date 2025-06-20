import { request } from '../base';

export const getTeams = (idLiga) => request({ url: '/getTeams', method: 'POST', data: { idLiga } });
