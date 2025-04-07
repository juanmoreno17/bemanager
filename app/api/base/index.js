import axios from 'axios';

const base = 'https://us-central1-bemanager-aa981.cloudfunctions.net/';

const instance = axios.create({ baseURL: base });

export const request = async (options) => {
    const onSuccess = (response) => response?.data;
    const onError = (error) => Promise.reject(error?.response?.data);
    return instance(options).then(onSuccess).catch(onError);
};
