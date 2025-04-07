import { request } from '../base';

export const createUser = (data) => request({ url: '/createUser', method: 'POST', data });
