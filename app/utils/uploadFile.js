import CryptoES from 'crypto-es';
import config from './config/config';

export function UploadFile(file) {
    const uri = file.assets[0].uri;
    const type = file.assets[0].type;
    const name = file.assets[0].fileName;

    const photo = { uri, type, name };
    const ts = Math.round(new Date().getTime() / 1000);
    const apiKey = config.CLOUDINARY_API_KEY;
    const apiSecret = config.CLOUDINARY_API_SECRET;
    const hash = `timestamp=${ts}${apiSecret}`;
    const signature = CryptoES.SHA1(hash).toString();
    const url = 'https://api.cloudinary.com/v1_1/daskrmb6s/image/upload';

    const formData = new FormData();
    formData.append('file', photo);
    formData.append('timestamp', ts);
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    return (
        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            //.then(res => console.log({ res }))
            .catch((err) => console.error({ err }))
    );
}
