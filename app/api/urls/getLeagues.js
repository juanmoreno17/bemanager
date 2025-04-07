import { request } from '../base';

export const getLeagues = (data) => request({ url: '/getLeagues', method: 'GET', data });
