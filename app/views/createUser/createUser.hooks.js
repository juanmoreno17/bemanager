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

    const onSubmit = (usr) => {
        mutateAsync(usr)
            .then(() => {
                auth()
                    .signInWithEmailAndPassword(usr.email, usr.password)
                    .then((user) => {
                        //console.log({ user, usr });
                        setUser(user.user);
                        navigation.navigate('Leagues');
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => console.error({ err }));
    };

    return {
        onSubmit,
    };
};
