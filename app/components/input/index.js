import React from 'react';
import { Text, TextInput } from 'react-native';
import { styles } from './input.styles';

export const Input = ({ title, custom, value }) => {
    return (
        <>
            <Text style={styles.title}>{title}</Text>
            <TextInput style={styles.text} value={value} {...custom} />
        </>
    );
};
