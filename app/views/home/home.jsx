import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './home.styles';
import { useMyContext } from '../../hooks/myContext';

export const Home = () => {
    const { myGameLeague } = useMyContext();
    const { user } = useMyContext();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Bienvenido a {myGameLeague.nombre}, {user.displayName}
            </Text>
        </View>
    );
};
