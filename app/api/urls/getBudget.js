import { request } from '../base';

export const getBudget = (idLigaJuego, idUsuario) =>
    request({ url: '/getBudget', method: 'POST', data: { idLigaJuego, idUsuario } });
