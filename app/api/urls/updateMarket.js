import { request } from '../base';

export const updateMarket = (data) => request({ url: '/updateMarket', method: 'POST', data });
