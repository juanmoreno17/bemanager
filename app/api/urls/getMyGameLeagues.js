import { request } from '../base';

export const getMyGameLeagues = () => request({ url: '/getMyGameLeagues', method: 'GET' });
