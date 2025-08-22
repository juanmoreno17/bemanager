import React from 'react';
import { Text, TextInput } from 'react-native';
import { styles } from './input.styles';

export const Input = ({ title, custom, value, placeholder }) => {
    return (
        <>
            <Text style={styles.title}>{title}</Text>
            <TextInput
                testID="text-input"
                placeholder={placeholder}
                style={styles.text}
                value={value}
                {...custom}
            />
        </>
    );
};
