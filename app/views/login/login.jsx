import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import { useLogin } from './login.hooks';

import { Button } from '../../components/button';
import { Input } from '../../components/input';

import { styles } from './login.styles';
import icono from '../../assets/icons/iconoo.png';

export const Login = ({ click = () => {}, print = () => {} }) => {
    const [Email, setEmail] = useState();
    const [Password, setPassword] = useState();

    const navigation = useNavigation();
    const { onSubmit } = useLogin();

    /*auth().signOut()
          .then(() => {

          }).catch((error) => {

          });*/

    useEffect(() => {
        auth().onAuthStateChanged((usr) => {
            if (usr) {
                navigation.navigate('Leagues');
            }
        });
    }, [navigation]);

    const cleanStates = () => {
        setEmail('');
        setPassword('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                <Image source={icono} style={styles.img} />
            </View>
            <View style={styles.subcontainer}>
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
                <Button
                    title="Login"
                    action={() => {
                        onSubmit(Email, Password, cleanStates);
                    }}
                />
                <TouchableOpacity onPress={() => navigation.navigate('CreateUser')}>
                    <Text style={{ color: '#52C1CA', fontWeight: 'bold', marginTop: 20 }}>
                        Create an Account
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
