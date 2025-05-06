import { request } from '../base';

export const getLeagues = () => request({ url: '/getLeagues', method: 'GET' });
