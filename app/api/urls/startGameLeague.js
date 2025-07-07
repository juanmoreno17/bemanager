import { request } from '../base';

export const startGameLeague = (data) => request({ url: '/startGameLeague', method: 'POST', data });
