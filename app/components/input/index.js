import React from 'react';
import { Text, TextInput } from 'react-native';
import { styles } from './input.styles';

export const Input = ({ title, custom, value, placeholder }) => {
    return (
        <>
            <Text style={styles.title}>{title}</Text>
            <TextInput
                testID="text-input"
                placeholder={custom?.placeholder || placeholder || ''}
                placeholderTextColor={custom?.placeholderTextColor}
                style={styles.text}
                value={value}
                {...custom}
            />
        </>
    );
};
