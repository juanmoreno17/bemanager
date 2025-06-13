import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../hooks/userContext';

export const useLogin = () => {
    const { setUser } = useUserContext();
    const navigation = useNavigation();

    const onSubmit = (Email, Password, cleanStates) => {
        auth()
            .signInWithEmailAndPassword(Email, Password)
            .then((usr) => {
                cleanStates();
                console.log(usr.user);
                setUser(usr.user);
                navigation.navigate('Leagues');
            })
            .catch((err) => console.error(err));
    };

    return {
        onSubmit,
    };
};
