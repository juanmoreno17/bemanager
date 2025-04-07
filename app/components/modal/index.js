import React from 'react';
import { Modal, TouchableOpacity, View, Image } from 'react-native';

import { styles } from './modal.styles';
import close from '../../assets/icons/close.png';

export function ModalCustom({
    onDismiss = () => null,
    onShow = () => null,
    visible,
    onClose,
    children,
}) {
    return (
        <Modal
            animationType="slide"
            onDismiss={onDismiss}
            onShow={onShow}
            transparent
            visible={visible}
        >
            <View style={styles.container}>
                <View style={styles.subcontainer}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={onClose}>
                            <Image source={close} style={styles.btnClose} />
                        </TouchableOpacity>
                    </View>
                    {children}
                </View>
            </View>
        </Modal>
    );
}
