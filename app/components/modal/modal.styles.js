import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(1, 1, 1, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subcontainer: {
        height: '80%',
        width: '90%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
    },
    headerContainer: {
        height: 45,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    btnClose: {
        width: 25,
        height: 25,
        tintColor: '#52C1CA',
    },
});
