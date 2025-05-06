import { request } from '../base';

export const createGameLeague = (data) =>
    request({ url: '/createGameLeague', method: 'POST', data });
