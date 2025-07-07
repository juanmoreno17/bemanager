import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    render: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    text3: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 25,
    },
    image1: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    image2: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    image3: {
        width: 35,
        height: 35,
        marginLeft: 7,
        marginTop: 7,
    },
    renderContainer2: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: '45%',
    },
    renderContainer3: {
        padding: 10,
    },
});
