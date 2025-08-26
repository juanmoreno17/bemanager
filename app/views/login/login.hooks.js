import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../hooks/userContext';

export const useLogin = () => {
    const { setUser } = useUserContext();
    const navigation = useNavigation();

    const onSubmit = (Email, Password, cleanStates, setErrors) => {
        let err = {};
        if (!Email) {
            err = { ...err, Email: 'El correo es obligatorio' };
        }
        if (!Password) {
            err = { ...err, Password: 'La contraseña es obligatoria' };
        }
        if (err.Email || err.Password) {
            setErrors((_errors) => ({ ..._errors, ...err }));
        } else {
            auth()
                .signInWithEmailAndPassword(Email, Password)
                .then((usr) => {
                    cleanStates();
                    console.log(usr.user);
                    setUser(usr.user);
                    navigation.navigate('Leagues');
                })
                .catch((err) => console.error(err));
        }
    };

    return {
        onSubmit,
    };
};
