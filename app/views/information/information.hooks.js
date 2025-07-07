import { Image, Text, View } from 'react-native';
import React from 'react';
import { styles } from './information.styles';
import PT from '../../assets/icons/PT.png';
import DF from '../../assets/icons/DF.png';
import MC from '../../assets/icons/MC.png';
import DL from '../../assets/icons/DL.png';

export const useInformation = () => {
    const getPositionIcon = (position) => {
        switch (position) {
            case 'Portero':
                return PT;
            case 'Defensa':
                return DF;
            case 'Mediocampista':
                return MC;
            case 'Delantero':
                return DL;
            default:
                return null;
        }
    };

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
            <View style={styles.renderContainer}>
                <Image source={{ uri: item.escudo }} style={styles.image2} />
            </View>
            <View style={styles.renderContainer3}>
                <View style={styles.renderSubContainer}>
                    <Text style={styles.text}>{item.nombre}</Text>
                    <Text style={styles.text2}>Estadio: {item.estadio}</Text>
                    <Text style={styles.text2}>Fundacion: {item.fundacion}</Text>
                </View>
            </View>
        </View>
    );

    const renderPlayers = ({ item }) => (
        <View key={item.idJugador} style={styles.render}>
            <View style={styles.renderContainer}>
                <Image source={{ uri: item.escudoEquipo }} style={styles.image1} />
                <Image source={getPositionIcon(item.posicion)} style={styles.image3} />
            </View>
            <View style={styles.renderContainer}>
                <Image source={{ uri: item.foto }} style={styles.image2} />
            </View>
            <View style={styles.renderContainer2}>
                <View style={styles.renderSubContainer}>
                    <Text style={styles.text}>{item.nombre}</Text>
                </View>
                <View style={styles.renderSubContainer}>
                    <Text style={styles.text}>{item.valor.toLocaleString('es-ES')} €</Text>
                    <Text style={styles.text}>{item.estado}</Text>
                </View>
            </View>
            <View style={styles.renderContainer2}>
                <Text style={styles.text3}>{item.puntuacion}</Text>
            </View>
        </View>
    );

    return {
        loadPlayers,
        renderTeams,
        renderPlayers,
    };
};
