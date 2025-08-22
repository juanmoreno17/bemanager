import React from 'react';
import { styles } from './button.styles';
import { Text, TouchableOpacity } from 'react-native';

export const Button = ({ title, action }) => {
    return (
        <TouchableOpacity testID="button" style={styles.btn} onPress={action}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};
