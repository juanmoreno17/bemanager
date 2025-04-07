import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';

//API
import { useApiMutation } from '../../api/hooks';
import { createUser } from '../../api/urls/users';

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

    const navigation = useNavigation();

    const { mutateAsync } = useApiMutation(
        createUser,
        () => console.log('User created'),
        (err) => console.error({ err }),
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    width: 75,
                    marginTop: 40,
                }}
                onPress={() => navigation.goBack()}
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
                <Text style={{ color: '#52C1CA', fontWeight: 'bold', fontSize: 16 }}>Back</Text>
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
                title="Username"
                custom={{
                    value: userName,
                    onChangeText: (name) => setUserName(name),
                }}
            />
            <Input
                title="Email"
                custom={{
                    value: Email,
                    onChangeText: (em) => setEmail(em),
                }}
            />
            <Input
                title="Password"
                custom={{
                    value: Password,
                    onChangeText: (psw) => setPassword(psw),
                    secureTextEntry: true,
                }}
            />
            <Input
                title="Phone"
                custom={{
                    value: Phone,
                    onChangeText: (ph) => setPhone(ph),
                }}
            />
            <Button
                title="Save"
                action={() => {
                    const usr = {
                        email: Email,
                        phoneNumber: Phone,
                        password: Password,
                        displayName: userName,
                        photoURL: Uri,
                    };
                    mutateAsync(usr)
                        .then(() => {
                            auth()
                                .signInWithEmailAndPassword(Email, Password)
                                .then((user) => {
                                    console.log({ user, usr });
                                    navigation.navigate('Leagues');
                                })
                                .catch((err) => console.error(err));
                        })
                        .catch((err) => console.error({ err }));
                }}
            />
        </View>
    );
};
