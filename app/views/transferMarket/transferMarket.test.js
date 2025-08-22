// app/views/transferMarket/transferMarket.test.js

// --- Mocks: SIEMPRE antes de importar el componente ---
jest.mock('../../hooks/gameLeagueContext', () => ({
    useGameLeagueContext: jest.fn(),
}));
jest.mock('../../hooks/userContext', () => ({
    useUserContext: jest.fn(),
}));
jest.mock('../../api/hooks', () => ({
    __esModule: true,
    useApiQuery: jest.fn(),
    useApiMutation: jest.fn(),
}));

// Simplificamos PlayerItem a un <Text> presionable que llama a action()
jest.mock('../../components/playerItem', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        PlayerItem: ({ item, action }) => (
            <Text accessibilityRole="button" onPress={action}>
                {item.nombre}
            </Text>
        ),
    };
});

// Modal que solo renderiza children si visible === true
jest.mock('../../components/modal', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        ModalCustom: ({ visible, children }) => (visible ? <View>{children}</View> : null),
    };
});

const nav = require('@react-navigation/native');

import React from 'react';
import { Alert, TextInput } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { TransferMarket } from './transferMarket';

import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useUserContext } from '../../hooks/userContext';
import { useApiQuery, useApiMutation } from '../../api/hooks';

describe('TransferMarket', () => {
    const myGameLeague = { idLiga: 'L1', idLigaJuego: 'GL1' };
    const user = { uid: 'U1' };

    const refetchBudget = jest.fn();
    const refetchMarket = jest.fn();

    const budgetPos = { data: 5_000_000 };
    const budgetNeg = { data: -100_000 };

    // Mercado: 2 jugadores
    const market = {
        data: [
            { idJugador: 'J1', nombre: 'Jugador 1', valor: 1_000_000 },
            { idJugador: 'J2', nombre: 'Jugador 2', valor: 2_000_000 },
        ],
        // fecha de actualización (forzamos que haya cuenta atrás)
        fechaActualizacion: '2025-08-22T12:00:00.000Z',
    };

    // Mutación (se sobrescribe por test cuando hace falta)
    const makeBidFn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Contextos
        useGameLeagueContext.mockReturnValue({ myGameLeague });
        useUserContext.mockReturnValue({ user });

        // Queries (mock por la KEY; en el componente se pasa una función anónima)
        useApiQuery.mockImplementation((key /*, fn */) => {
            if (Array.isArray(key) && key[0] === 'getBudget') {
                return { data: budgetPos, isLoading: false, refetch: refetchBudget };
            }
            if (Array.isArray(key) && key[0] === 'getMarket') {
                return { data: market, isLoading: false, refetch: refetchMarket };
            }
            return { isLoading: false, refetch: jest.fn() };
        });

        // Mutación base
        useApiMutation.mockReturnValue({ mutate: makeBidFn });

        // Ejecuta el callback de useFocusEffect al montar
        jest.spyOn(nav, 'useFocusEffect').mockImplementation((cb) => cb());

        // Alert
        jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    });

    it('renderiza presupuesto, cuenta atrás y lista de jugadores', () => {
        const { getByText } = renderWithProviders(<TransferMarket />);
        // Presupuesto (permitimos . o , como separador)
        expect(getByText(/Presupuesto:\s*5[\.,]000[\.,]000 €/)).toBeTruthy();
        // Cuenta atrás
        expect(getByText(/Próxima actualización del mercado en:/)).toBeTruthy();
        // Jugadores
        expect(getByText('Jugador 1')).toBeTruthy();
        expect(getByText('Jugador 2')).toBeTruthy();
    });

    it('muestra aviso si el presupuesto es negativo', () => {
        useApiQuery.mockImplementation((key) => {
            if (key[0] === 'getBudget') {
                return { data: budgetNeg, isLoading: false, refetch: refetchBudget };
            }
            if (key[0] === 'getMarket') {
                return { data: market, isLoading: false, refetch: refetchMarket };
            }
            return { isLoading: false, refetch: jest.fn() };
        });

        const { getByText } = renderWithProviders(<TransferMarket />);
        expect(
            getByText(
                'Recuerda estar en saldo positivo antes de empezar la jornada, sino no puntuarás',
            ),
        ).toBeTruthy();
    });

    it('useFocusEffect dispara refetchBudget y refetchMarket en el montaje', () => {
        renderWithProviders(<TransferMarket />);
        expect(refetchBudget).toHaveBeenCalled();
        expect(refetchMarket).toHaveBeenCalled();
    });

    it('abre modal al pulsar un jugador', () => {
        const { getByText } = renderWithProviders(<TransferMarket />);
        // PlayerItem mock => <Text onPress={action}>
        fireEvent.press(getByText('Jugador 1'));
        // Dentro del modal debe aparecer el botón "Hacer puja"
        expect(getByText('Hacer puja')).toBeTruthy();
    });

    it('validación: puja vacía', () => {
        const { getByText } = renderWithProviders(<TransferMarket />);
        fireEvent.press(getByText('Jugador 1'));
        fireEvent.press(getByText('Hacer puja'));
        expect(getByText('El valor de la puja no puede estar vacío')).toBeTruthy();
    });

    it('validación: puja menor al valor del jugador', () => {
        const { getByText, UNSAFE_getAllByType } = renderWithProviders(<TransferMarket />);
        fireEvent.press(getByText('Jugador 1')); // valor = 1_000_000

        const [bidInput] = UNSAFE_getAllByType(TextInput);
        fireEvent.changeText(bidInput, '900000'); // menor que 1_000_000

        fireEvent.press(getByText('Hacer puja'));
        expect(
            getByText('El valor de la puja debe ser mayor o igual al valor del jugador'),
        ).toBeTruthy();
    });

    it('validación: puja mayor al 150% del valor del jugador', () => {
        const { getByText, UNSAFE_getAllByType } = renderWithProviders(<TransferMarket />);
        fireEvent.press(getByText('Jugador 1')); // valor = 1_000_000

        const [bidInput] = UNSAFE_getAllByType(TextInput);
        fireEvent.changeText(bidInput, '1600000'); // > 1.5 * 1_000_000

        fireEvent.press(getByText('Hacer puja'));
        expect(
            getByText('El valor de la puja no puede ser mayor al 150% del valor del jugador'),
        ).toBeTruthy();
    });

    it('éxito con mensaje: muestra Alert.alert y NO cierra modal', async () => {
        // 1) Mock de mutate que ejecuta onSuccess({ message: 'Puja registrada' })
        const mutateMock = jest.fn((payload, opts) => {
            Promise.resolve().then(() => opts?.onSuccess?.({ message: 'Puja registrada' }));
        });
        useApiMutation.mockImplementation(() => ({ mutate: mutateMock }));

        // 2) Espía de Alert.alert
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

        const { getByText, UNSAFE_getAllByType } = renderWithProviders(<TransferMarket />);

        // Abrir modal pulsando jugador
        fireEvent.press(getByText('Jugador 1'));

        // Teclear puja válida (entre valor y 150%)
        const [bidInput] = UNSAFE_getAllByType(TextInput);
        fireEvent.changeText(bidInput, '1200000');

        // Enviar
        fireEvent.press(getByText('Hacer puja'));

        // 3) Aseguramos que se llamó mutate
        await waitFor(() => expect(mutateMock).toHaveBeenCalled());

        // 4) Espera a que onSuccess dispare el Alert y verifica que el modal sigue abierto
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('', 'Puja registrada');
            expect(getByText('Hacer puja')).toBeTruthy(); // sigue visible (no se cierra)
        });
    });

    it('éxito sin mensaje: cierra el modal (desaparece "Hacer puja")', async () => {
        // 1) Mock de mutate que ejecuta onSuccess({}) → cleanStates() → cierra modal
        const mutateMock = jest.fn((payload, opts) => {
            Promise.resolve().then(() => opts?.onSuccess?.({}));
        });
        useApiMutation.mockImplementation(() => ({ mutate: mutateMock }));

        const { getByText, queryByText, UNSAFE_getAllByType } = renderWithProviders(
            <TransferMarket />,
        );

        // Abrir modal
        fireEvent.press(getByText('Jugador 1'));

        const [bidInput] = UNSAFE_getAllByType(TextInput);
        fireEvent.changeText(bidInput, '1200000');

        fireEvent.press(getByText('Hacer puja'));

        // 2) mutate fue llamado
        await waitFor(() => expect(mutateMock).toHaveBeenCalled());

        // 3) Tras onSuccess sin message, el modal se cierra
        await waitFor(() => {
            expect(queryByText('Hacer puja')).toBeNull();
        });
    });

    it('retorna null si budgetLoading o marketLoading = true', () => {
        useApiQuery.mockImplementation((key) => {
            if (key[0] === 'getBudget') {
                return { isLoading: true, refetch: refetchBudget };
            }
            if (key[0] === 'getMarket') {
                return { isLoading: false, data: market, refetch: refetchMarket };
            }
            return { isLoading: false, refetch: jest.fn() };
        });

        const { queryByText } = renderWithProviders(<TransferMarket />);
        expect(queryByText(/Presupuesto/)).toBeNull();
    });
});
