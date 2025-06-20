import { Text, View } from 'react-native';
import React from 'react';
import { styles } from './information.styles';

export const useInformation = () => {
    const loadPlayers = async (refetchPlayers, setItemList, setLastVisible) => {
        const { data: playersData } = await refetchPlayers();
        //console.log('Response from refetchPlayers:', playersData);
        if (playersData.data.length > 0) {
            setItemList((prev) => {
                const existingIds = new Set(prev.map((item) => item.idJugador));
                const newPlayers = playersData.data.filter(
                    (player) => !existingIds.has(player.idJugador),
                );
                return [...prev, ...newPlayers];
            });
            setLastVisible(playersData.lastVisible);
        } else {
            console.log('No more players to load');
        }
    };

    const renderTeams = ({ item }) => (
        <View key={item.idEquipo} style={styles.render}>
            <Text style={styles.text}>{item.nombre}</Text>
        </View>
    );

    const renderPlayers = ({ item }) => (
        <View key={item.idJugador} style={styles.render}>
            <Text style={styles.text}>{item.nombre}</Text>
        </View>
    );

    return {
        loadPlayers,
        renderTeams,
        renderPlayers,
    };
};
