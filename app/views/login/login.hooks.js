import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useMyContext } from '../../hooks/myContext';

export const useLogin = () => {
    const { setUser } = useMyContext();
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
