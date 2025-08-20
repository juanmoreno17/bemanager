import { request } from '../base';

export const getPlayers = (data) => request({ url: '/getPlayers', method: 'POST', data });
