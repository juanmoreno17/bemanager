import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './home.styles';
import { useUserContext } from '../../hooks/userContext';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { Button } from '../../components/button';

export const Home = () => {
    const { myGameLeague } = useGameLeagueContext();
    const { user } = useUserContext();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Bienvenido a {myGameLeague.nombre}, {user.displayName}
            </Text>
            {user.uid === myGameLeague.propietario && (
                <>
                    <Text style={styles.title}>Panel de Administracion de la Liga</Text>
                    <Text style={styles.title} onPress={() => null}>
                        Manual del admin
                    </Text>
                    <Button title="Empezar liga" action={() => null} />
                    <Button title="Actualizar mercado" action={() => null} />
                    <Button title="Actualizar clasificacion" action={() => null} />
                </>
            )}
        </View>
    );
};
