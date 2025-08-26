import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

//Hooks
import { useCreateUser } from './createUser.hooks';

//Components
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { ModalCustom } from '../../components/modal';

//Styles
import { styles } from './createUser.styles';

//Assets
import userImg from '../../assets/icons/usuario.png';
import back from '../../assets/icons/back.png';

//Utils
import { UploadFile } from '../../utils/uploadFile';

export const CreateUser = (props) => {
    const [userName, setUserName] = useState();
    const [Email, setEmail] = useState();
    const [Password, setPassword] = useState();
    const [Phone, setPhone] = useState();
    const [Uri, setUri] = useState();
    const [view, setView] = useState(false);
    const [errors, setErrors] = useState({ userName: '', Email: '', Password: '', Phone: '' });

    const navigation = useNavigation();

    const { onSubmit } = useCreateUser();

    const cleanStates = () => {
        setUserName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setErrors({ userName: '', Email: '', Password: '', Phone: '' });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    width: 75,
                    marginTop: 40,
                }}
                onPress={() => {
                    navigation.goBack();
                    cleanStates();
                }}
            >
                <Image
                    source={back}
                    style={{
                        width: 15,
                        height: 15,
                        tintColor: '#52C1CA',
                        marginLeft: 5,
                        marginRight: 5,
                        marginTop: 4,
                    }}
                />
                <Text style={{ color: '#52C1CA', fontWeight: 'bold', fontSize: 16 }}>Volver</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    marginLeft: 75,
                    height: 200,
                    width: 200,
                    borderRadius: 100,
                    borderColor: '#52C1CA',
                    borderWidth: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => {
                    setView(true);
                }}
            >
                <Image
                    source={Uri ? { uri: Uri } : userImg}
                    testID="profile-picture"
                    style={{
                        height: 120,
                        width: 120,
                    }}
                />
            </TouchableOpacity>
            <ModalCustom visible={view} onClose={() => setView(false)}>
                <Button
                    title="Tomar Foto"
                    action={() => {
                        const options = {
                            mediaType: 'photo',
                            includeBase64: false,
                            maxHeight: 200,
                            maxWidth: 200,
                            saveToPhotos: true,
                        };
                        launchCamera(options, (res) => {
                            if (!res.didCancel) {
                                UploadFile(res).then((file) => {
                                    //console.log({ file });
                                    setUri(file.secure_url);
                                });
                            }
                        });
                    }}
                />
                <Button
                    title="Abrir Galeria"
                    action={() => {
                        const options = {
                            mediaType: 'photo',
                            includeBase64: false,
                            maxHeight: 200,
                            maxWidth: 200,
                            saveToPhotos: true,
                        };
                        launchImageLibrary(options, (res) => {
                            if (!res.didCancel) {
                                UploadFile(res).then((file) => {
                                    //console.log({ file });
                                    setUri(file.secure_url);
                                });
                            }
                        });
                    }}
                />
            </ModalCustom>
            <Input
                title="Nombre de usuario"
                custom={{
                    placeholder: 'Nombre de usuario',
                    value: userName,
                    onChangeText: (name) => {
                        setUserName(name);
                        setErrors((err) => ({ ...err, userName: '' }));
                    },
                }}
            />
            {errors.userName ? <Text style={styles.error}>{errors.userName}</Text> : null}
            <Input
                title="Correo electrónico"
                custom={{
                    placeholder: 'Correo electrónico',
                    value: Email,
                    onChangeText: (em) => {
                        setEmail(em);
                        setErrors((err) => ({ ...err, Email: '' }));
                    },
                }}
            />
            {errors.Email ? <Text style={styles.error}>{errors.Email}</Text> : null}
            <Input
                title="Contraseña"
                custom={{
                    placeholder: 'Contraseña',
                    value: Password,
                    onChangeText: (psw) => {
                        setPassword(psw);
                        setErrors((err) => ({ ...err, Password: '' }));
                    },
                    secureTextEntry: true,
                }}
            />
            {errors.Password ? <Text style={styles.error}>{errors.Password}</Text> : null}
            <Input
                title="Teléfono"
                custom={{
                    placeholder: 'Teléfono',
                    value: Phone,
                    onChangeText: (ph) => {
                        setPhone(ph);
                        setErrors((err) => ({ ...err, Phone: '' }));
                    },
                }}
            />
            {errors.Phone ? <Text style={styles.error}>{errors.Phone}</Text> : null}
            <Button
                title="Guardar"
                action={() => {
                    const usr = {
                        email: Email,
                        phoneNumber: Phone,
                        password: Password,
                        displayName: userName,
                        photoURL: Uri,
                    };
                    onSubmit(usr, cleanStates, setErrors);
                }}
            />
        </View>
    );
};
