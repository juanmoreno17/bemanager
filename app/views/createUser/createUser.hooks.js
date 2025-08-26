import { useApiMutation } from '../../api/hooks';
import { createUser } from '../../api/urls/users';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../hooks/userContext';

export const useCreateUser = () => {
    const { setUser } = useUserContext();
    const navigation = useNavigation();

    const { mutateAsync } = useApiMutation(
        createUser,
        () => console.log('User created'),
        (err) => console.error({ err }),
    );

    const onSubmit = (usr, cleanStates, setErrors) => {
        let err = {};
        if (!usr.displayName) {
            err = { ...err, userName: 'El nombre de usuario es obligatorio' };
        }
        if (!usr.email) {
            err = { ...err, Email: 'El correo es obligatorio' };
        }
        if (!usr.password) {
            err = { ...err, Password: 'La contraseña es obligatoria' };
        }
        if (!usr.phoneNumber) {
            err = { ...err, Phone: 'El teléfono es obligatorio' };
        }
        if (err.userName || err.Email || err.Password || err.Phone) {
            setErrors((_errors) => ({ ..._errors, ...err }));
        } else {
            mutateAsync(usr)
                .then(() => {
                    auth()
                        .signInWithEmailAndPassword(usr.email, usr.password)
                        .then((user) => {
                            cleanStates();
                            setUser(user.user);
                            navigation.navigate('Leagues');
                        })
                        .catch((err) => console.error(err));
                })
                .catch((err) => console.error({ err }));
        }
    };

    return {
        onSubmit,
    };
};
