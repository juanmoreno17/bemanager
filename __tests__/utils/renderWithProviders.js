import React from 'react';
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockSetOptions = jest.fn();

jest.mock('@react-navigation/native', () => {
    const actual = jest.requireActual('@react-navigation/native');
    return {
        ...actual,
        useNavigation: () => ({
            navigate: mockNavigate,
            goBack: mockGoBack,
            setOptions: mockSetOptions,
        }),
    };
});

jest.mock('../../app/components/button', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        Button: ({ title, action }) => (
            <Text accessibilityRole="button" onPress={action}>
                {title}
            </Text>
        ),
    };
});

jest.mock('../../app/components/input', () => {
    const React = require('react');
    const { Text, TextInput } = require('react-native');
    return {
        Input: ({ title, placeholder, custom }) => (
            <>
                <Text>{title}</Text>
                <TextInput
                    testID={
                        title === 'Correo electrónico'
                            ? 'email-input'
                            : title === 'Contraseña'
                              ? 'password-input'
                              : 'text-input'
                    }
                    placeholder={custom?.placeholder || placeholder}
                    value={custom?.value}
                    onChangeText={custom?.onChangeText}
                />
            </>
        ),
    };
});

jest.mock('../../app/components/modal', () => {
    const React = require('react');
    return {
        ModalCustom: ({ visible, children }) => (visible ? children : null),
    };
});

const mockLaunchImageLibrary = jest.fn();
const mockLaunchCamera = jest.fn();

jest.mock('react-native-image-picker', () => ({
    launchImageLibrary: (...args) => mockLaunchImageLibrary(...args),
    launchCamera: (...args) => mockLaunchCamera(...args),
}));

jest.mock('../../app/assets/icons/usuario.png', () => 1);
jest.mock('../../app/assets/icons/back.png', () => 1);

export function renderWithProviders(ui, options) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                refetchInterval: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    const Wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return render(ui, { wrapper: Wrapper, ...options });
}

export { mockNavigate, mockGoBack, mockSetOptions, mockLaunchImageLibrary, mockLaunchCamera };
