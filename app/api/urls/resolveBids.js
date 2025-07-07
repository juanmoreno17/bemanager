import { request } from '../base';

export const resolveBids = (idLigaJuego) =>
    request({ url: '/resolveBids', method: 'POST', data: { idLigaJuego } });
