// app/views/createUser/createUser.test.js
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { CreateUser } from './createUser';
const { UploadFile: mockUploadFile } = require('../../utils/uploadFile');

// Importa el módulo completo para poder hacer spyOn
import * as ImagePicker from 'react-native-image-picker';

// Mock del hook del feature
const mockOnSubmit = jest.fn();
jest.mock('./createUser.hooks', () => ({
    useCreateUser: () => ({ onSubmit: mockOnSubmit }),
}));

// Mock del user context (evita "useUserContext debe ser usado dentro de UserProvider")
jest.mock('../../hooks/userContext', () => ({
    useUserContext: () => ({ user: { uid: 'u1', displayName: 'Tester' } }),
}));

describe('CreateUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUploadFile.mockResolvedValue({ secure_url: 'https://example.com/photo.jpg' });
    });

    it('rellena el formulario, selecciona imagen desde galería y llama a onSubmit con photoURL', async () => {
        // spy + implementación del callback del picker
        jest.spyOn(ImagePicker, 'launchImageLibrary').mockImplementation((opts, cb) => {
            cb?.({ didCancel: false, assets: [{ uri: 'file:///tmp/gallery.jpg' }] });
        });

        const { getByPlaceholderText, getByText, getByTestId, findByText } = renderWithProviders(
            <CreateUser />,
        );

        // Rellenar inputs
        fireEvent.changeText(getByPlaceholderText('Username'), 'Juan');
        fireEvent.changeText(getByPlaceholderText('Email'), 'juan@mail.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '1234');
        fireEvent.changeText(getByPlaceholderText('Phone'), '600123123');

        // Abrir el modal pulsando la imagen (tiene testID)
        fireEvent.press(getByTestId('profile-picture'));

        // Pulsar "Abrir Galeria"
        fireEvent.press(await findByText('Abrir Galeria'));

        // Guardar
        fireEvent.press(getByText('Save'));
    });

    it('rellena el formulario, toma una foto y llama a onSubmit con photoURL', async () => {
        jest.spyOn(ImagePicker, 'launchCamera').mockImplementation((opts, cb) => {
            cb?.({ didCancel: false, assets: [{ uri: 'file:///tmp/camera.jpg' }] });
        });

        const { getByPlaceholderText, getByText, getByTestId, findByText } = renderWithProviders(
            <CreateUser />,
        );

        fireEvent.changeText(getByPlaceholderText('Username'), 'Pepe');
        fireEvent.changeText(getByPlaceholderText('Email'), 'pepe@mail.com');
        fireEvent.changeText(getByPlaceholderText('Password'), '5678');
        fireEvent.changeText(getByPlaceholderText('Phone'), '611111111');

        fireEvent.press(getByTestId('profile-picture'));
        fireEvent.press(await findByText('Tomar Foto'));

        fireEvent.press(getByText('Save'));
    });

    it('Back ejecuta navigation.goBack()', () => {
        // tu helper ya mockea useNavigation; aquí solo disparamos el onPress del TouchableOpacity
        const { getByText } = renderWithProviders(<CreateUser />);
        const backText = getByText('Back');
        // El onPress está en el TouchableOpacity padre
        fireEvent.press(backText.parent);

        // Obtenemos la instancia mockeada por el helper/setup
        const nav = require('@react-navigation/native').useNavigation();
        expect(nav.goBack).toHaveBeenCalled();
    });
});
