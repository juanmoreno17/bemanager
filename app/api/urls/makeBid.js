import { request } from '../base';

export const makeBid = (data) => request({ url: '/makeBid', method: 'POST', data });
