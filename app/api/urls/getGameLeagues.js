import { request } from '../base';

export const getGameLeagues = () => request({ url: '/getGameLeagues', method: 'GET' });
