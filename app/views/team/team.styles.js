import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginBottom: 95,
    },
    render: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderColor: '#52C1CA',
        borderWidth: 1,
        borderRadius: 10,
    },
    text2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    warning: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
