import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import { useLogin } from './login.hooks';
import { useUserContext } from '../../hooks/userContext';

import { Button } from '../../components/button';
import { Input } from '../../components/input';

import { styles } from './login.styles';
import icono from '../../assets/icons/iconoo.png';

export const Login = ({ click = () => {}, print = () => {} }) => {
    const [Email, setEmail] = useState();
    const [Password, setPassword] = useState();
    const { setUser } = useUserContext();
    const [errors, setErrors] = useState({ Email: '', Password: '' });

    const navigation = useNavigation();
    const { onSubmit } = useLogin();

    useEffect(() => {
        auth().onAuthStateChanged((usr) => {
            if (usr) {
                setUser(usr);
                navigation.navigate('Leagues');
            }
        });
    }, [navigation]);

    const cleanStates = () => {
        setEmail('');
        setPassword('');
        setErrors({ Email: '', Password: '' });
    };

    return (
        <View style={styles.container}>
            <Image source={icono} style={styles.img} />
            <Input
                title="Correo electrónico"
                custom={{
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
                    value: Password,
                    onChangeText: (pw) => {
                        setPassword(pw);
                        setErrors((err) => ({ ...err, Password: '' }));
                    },
                    secureTextEntry: true,
                }}
            />
            {errors.Password ? <Text style={styles.error}>{errors.Password}</Text> : null}
            <Button
                title="Iniciar sesión"
                action={() => {
                    onSubmit(Email, Password, cleanStates, setErrors);
                }}
            />
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('CreateUser');
                    cleanStates();
                }}
            >
                <Text
                    style={{
                        color: '#52C1CA',
                        fontWeight: 'bold',
                        marginTop: 20,
                        textAlign: 'center',
                    }}
                >
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>
        </View>
    );
};
