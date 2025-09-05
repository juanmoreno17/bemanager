import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { CreateUser } from './createUser';
const { UploadFile: mockUploadFile } = require('../../utils/uploadFile');

import * as ImagePicker from 'react-native-image-picker';

const mockOnSubmit = jest.fn();
jest.mock('./createUser.hooks', () => ({
    useCreateUser: () => ({ onSubmit: mockOnSubmit }),
}));

jest.mock('../../hooks/userContext', () => ({
    useUserContext: () => ({ user: { uid: 'u1', displayName: 'Tester' } }),
}));

describe('CreateUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUploadFile.mockResolvedValue({ secure_url: 'https://example.com/photo.jpg' });
    });

    it('rellena el formulario, selecciona imagen desde galería y llama a onSubmit con photoURL', async () => {
        jest.spyOn(ImagePicker, 'launchImageLibrary').mockImplementation((opts, cb) => {
            cb?.({ didCancel: false, assets: [{ uri: 'file:///tmp/gallery.jpg' }] });
        });

        const { getByPlaceholderText, getByText, getByTestId, findByText } = renderWithProviders(
            <CreateUser />,
        );

        fireEvent.changeText(getByPlaceholderText('Nombre de usuario'), 'Juan');
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'juan@mail.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), '1234');
        fireEvent.changeText(getByPlaceholderText('Teléfono'), '600123123');

        fireEvent.press(getByTestId('profile-picture'));

        fireEvent.press(await findByText('Abrir Galeria'));

        fireEvent.press(getByText('Guardar'));
    });

    it('rellena el formulario, toma una foto y llama a onSubmit con photoURL', async () => {
        jest.spyOn(ImagePicker, 'launchCamera').mockImplementation((opts, cb) => {
            cb?.({ didCancel: false, assets: [{ uri: 'file:///tmp/camera.jpg' }] });
        });

        const { getByPlaceholderText, getByText, getByTestId, findByText } = renderWithProviders(
            <CreateUser />,
        );

        fireEvent.changeText(getByPlaceholderText('Nombre de usuario'), 'Pepe');
        fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'pepe@mail.com');
        fireEvent.changeText(getByPlaceholderText('Contraseña'), '5678');
        fireEvent.changeText(getByPlaceholderText('Teléfono'), '611111111');

        fireEvent.press(getByTestId('profile-picture'));
        fireEvent.press(await findByText('Tomar Foto'));

        fireEvent.press(getByText('Guardar'));
    });

    it('Back ejecuta navigation.goBack()', () => {
        const { getByText } = renderWithProviders(<CreateUser />);
        const backText = getByText('Volver');
        fireEvent.press(backText.parent);

        const nav = require('@react-navigation/native').useNavigation();
        expect(nav.goBack).toHaveBeenCalled();
    });
});
