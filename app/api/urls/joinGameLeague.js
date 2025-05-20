import { request } from '../base';

export const joinGameLeague = (data) => request({ url: '/joinGameLeague', method: 'POST', data });
