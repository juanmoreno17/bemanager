import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ModalCustom } from './index';

describe('ModalCustom', () => {
    it('renders correctly when visible is true', () => {
        const { getByTestId } = render(
            <ModalCustom visible={true} onClose={() => {}}>
                <View testID="modal-content" />
            </ModalCustom>,
        );
        expect(getByTestId('modal-content')).toBeTruthy();
    });

    it('does not render content when visible is false', () => {
        const { queryByTestId } = render(
            <ModalCustom visible={false} onClose={() => {}}>
                <View testID="modal-content" />
            </ModalCustom>,
        );
        expect(queryByTestId('modal-content')).toBeNull();
    });

    it('calls onClose when close button is pressed', () => {
        const mockOnClose = jest.fn();
        const { getByRole } = render(
            <ModalCustom visible={true} onClose={mockOnClose}>
                <View />
            </ModalCustom>,
        );
        fireEvent.press(getByRole('button'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
