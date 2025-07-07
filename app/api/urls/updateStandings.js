import { request } from '../base';

export const updateStandings = (data) => request({ url: '/updateStandings', method: 'POST', data });
