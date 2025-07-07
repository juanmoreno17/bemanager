import { request } from '../base';

export const sellPlayer = (data) => request({ url: '/sellPlayer', method: 'POST', data });
