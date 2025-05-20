import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    itemContainer: {
        width: '100%',
        height: 200,
        borderBottomColor: '#FFF',
        borderBottomWidth: 1,
    },
    itemImage: {
        width: '100%',
        height: 100,
    },
    itemTitle: {
        color: '#FFF',
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    itemContent: {
        color: '#FFF',
        fontSize: 10,
        marginLeft: 10,
        marginTop: 5,
    },
    title: {
        color: '#52C1CA',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    errorLabel: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
