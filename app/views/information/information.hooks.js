import { Image, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './information.styles';

export const useInformation = () => {
    const renderTeams = ({ item, action }) => (
        <View key={item.idEquipo}>
            <TouchableOpacity onPress={action} style={styles.render}>
                <View>
                    <Image source={{ uri: item.escudo }} style={styles.image2} />
                </View>
                <View style={styles.renderContainer3}>
                    <View>
                        <Text style={styles.text}>{item.nombre}</Text>
                        <Text style={styles.text2}>Estadio: {item.estadio}</Text>
                        <Text style={styles.text2}>Fundacion: {item.fundacion}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return {
        renderTeams,
    };
};
