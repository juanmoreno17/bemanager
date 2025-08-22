// app/views/login/login.test.js

// --- Mocks: SIEMPRE antes de importar el componente ---
jest.mock('./login.hooks', () => ({
    useLogin: jest.fn(),
}));

jest.mock('../../hooks/userContext', () => ({
    useUserContext: jest.fn(),
}));

// Mock de Firebase Auth: auth() devuelve onAuthStateChanged espía
jest.mock('@react-native-firebase/auth', () => {
    const onAuthStateChanged = jest.fn();
    const signOut = jest.fn();
    const authFn = jest.fn(() => ({
        onAuthStateChanged,
        signOut,
    }));
    // Exponer para inspección en los tests (vía require)
    authFn._onAuthStateChanged = onAuthStateChanged;
    return authFn;
});

// --- Ahora importa dependencias y el SUT ---
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders, mockNavigate } from '../../../__tests__/utils/renderWithProviders';
import { Login } from './login';

import { useLogin } from './login.hooks';
import { useUserContext } from '../../hooks/userContext';

describe('Login', () => {
    const onSubmit = jest.fn();
    const setUser = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Hooks
        useLogin.mockReturnValue({ onSubmit });
        useUserContext.mockReturnValue({ setUser });
    });

    it('renderiza inputs, botón Login y link "Create an Account"', () => {
        const { getByText } = renderWithProviders(<Login />);

        // El mock de Input del helper renderiza el título como <Text>
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Password')).toBeTruthy();

        // Botón
        expect(getByText('Login')).toBeTruthy();

        // Link
        expect(getByText('Create an Account')).toBeTruthy();
    });

    it('pulsa Login y llama a onSubmit con email, password y cleanStates', () => {
        const { getByTestId, getByText } = renderWithProviders(<Login />);

        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'secret123');

        fireEvent.press(getByText('Login'));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        const [email, password, cleanStates] = onSubmit.mock.calls[0];

        expect(email).toBe('test@example.com');
        expect(password).toBe('secret123');
        expect(typeof cleanStates).toBe('function');
    });

    it('al pulsar "Create an Account" navega a CreateUser', () => {
        const { getByText } = renderWithProviders(<Login />);

        fireEvent.press(getByText('Create an Account'));

        expect(mockNavigate).toHaveBeenCalledWith('CreateUser');
    });

    it('cuando onAuthStateChanged recibe usuario, setUser y navega a Leagues', async () => {
        const auth = require('@react-native-firebase/auth');
        const {} = renderWithProviders(<Login />);

        // Recupera el callback pasado a onAuthStateChanged y ejecútalo con un usuario simulado
        const cb = auth._onAuthStateChanged.mock.calls[0][0];
        const fakeUser = { uid: 'u1', email: 'test@example.com' };
        cb(fakeUser);

        await waitFor(() => {
            expect(setUser).toHaveBeenCalledWith(fakeUser);
            expect(mockNavigate).toHaveBeenCalledWith('Leagues');
        });
    });
});
