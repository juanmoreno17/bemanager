import { request } from '../base';

export const createLeagues = (data) => request({ url: '/createLeagues', method: 'POST', data });
