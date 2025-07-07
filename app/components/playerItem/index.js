import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PT from '../../assets/icons/PT.png';
import DF from '../../assets/icons/DF.png';
import MC from '../../assets/icons/MC.png';
import DL from '../../assets/icons/DL.png';
import { styles } from './playerItem.styles';

export const PlayerItem = ({ item, action }) => {
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

    return (
        <View key={item.idJugador}>
            <TouchableOpacity onPress={action} style={styles.render}>
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
                <View style={styles.renderContainer3}>
                    <Text style={styles.text3}>{item.puntuacion}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};
