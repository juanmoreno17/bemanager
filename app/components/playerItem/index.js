import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PT from '../../assets/icons/PT.png';
import DF from '../../assets/icons/DF.png';
import MC from '../../assets/icons/MC.png';
import DL from '../../assets/icons/DL.png';
import { styles } from './playerItem.styles';

export const PlayerItem = ({ item, action, showSellButton, showTouchable, disabled }) => {
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
            {showTouchable ? (
                <TouchableOpacity
                    testID="TouchableOpacity"
                    onPress={action}
                    style={styles.render}
                    disabled={disabled}
                >
                    <View>
                        <Image source={{ uri: item.escudoEquipo }} style={styles.image1} />
                        <Image source={getPositionIcon(item.posicion)} style={styles.image3} />
                    </View>
                    <View>
                        <Image source={{ uri: item.foto }} style={styles.image2} />
                    </View>
                    <View style={styles.renderContainer2}>
                        <View>
                            <Text style={styles.text}>{item.nombre}</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>{item.valor.toLocaleString('es-ES')} €</Text>
                            <Text style={styles.text}>{item.estado}</Text>
                        </View>
                    </View>
                    <View style={styles.renderContainer3}>
                        <Text style={styles.text3}>{item.puntuacionTotal}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={styles.render}>
                    <View>
                        <Image source={{ uri: item.escudoEquipo }} style={styles.image1} />
                        <Image source={getPositionIcon(item.posicion)} style={styles.image3} />
                    </View>
                    <View>
                        <Image source={{ uri: item.foto }} style={styles.image2} />
                    </View>
                    <View style={styles.renderContainer2}>
                        <View>
                            <Text style={styles.text}>{item.nombre}</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>{item.valor.toLocaleString('es-ES')} €</Text>
                            <Text style={styles.text}>{item.estado}</Text>
                        </View>
                    </View>
                    <View style={styles.renderContainer3}>
                        <Text style={styles.text3}>{item.puntuacionTotal}</Text>
                        {showSellButton && (
                            <Text style={styles.text2} onPress={action}>
                                Vender
                            </Text>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};
