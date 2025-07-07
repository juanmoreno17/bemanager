import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginBottom: 80,
    },
    render: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderColor: '#52C1CA',
        borderWidth: 1,
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    text2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
        width: '55%',
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
});
