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

const nav = require('@react-navigation/native');

import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { Team } from './team';

import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useUserContext } from '../../hooks/userContext';
import { useApiQuery, useApiMutation } from '../../api/hooks';

describe('Team', () => {
    const myGameLeague = { idLiga: 'L1', idLigaJuego: 'GL1' };
    const user = { uid: 'U1' };

    const refetchBudget = jest.fn();
    const refetchSquad = jest.fn();

    const budgetOk = { data: 5_000_000 };
    const budgetNeg = { data: -100_000 };

    const squad = {
        data: [
            { idJugador: 'J1', nombre: 'Jugador 1' },
            { idJugador: 'J2', nombre: 'Jugador 2' },
        ],
    };

    const sellPlayerFn = jest.fn((vars, opts) => {
        opts?.onSuccess?.();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useGameLeagueContext.mockReturnValue({ myGameLeague });
        useUserContext.mockReturnValue({ user });
        useApiQuery.mockImplementation((key) => {
            if (Array.isArray(key) && key[0] === 'getBudget') {
                return { data: budgetOk, isLoading: false, refetch: refetchBudget };
            }
            if (Array.isArray(key) && key[0] === 'getSquad') {
                return { data: squad, isLoading: false, refetch: refetchSquad };
            }
            return { isLoading: false, refetch: jest.fn() };
        });
        useApiMutation.mockReturnValue({ mutate: sellPlayerFn });
        jest.spyOn(nav, 'useFocusEffect').mockImplementation((cb) => cb());
        jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
            const yes = buttons?.find((b) => b.text === 'Si');
            yes?.onPress?.();
        });
    });

    it('renderiza presupuesto y lista de jugadores cuando no hay loading', () => {
        const { getByText } = renderWithProviders(<Team />);

        expect(getByText(/Presupuesto:\s*5[\.,]000[\.,]000 €/)).toBeTruthy();

        expect(getByText('Jugador 1')).toBeTruthy();
        expect(getByText('Jugador 2')).toBeTruthy();
    });

    it('muestra aviso si el presupuesto es negativo', () => {
        useApiQuery.mockImplementation((key) => {
            if (key[0] === 'getBudget') {
                return { data: budgetNeg, isLoading: false, refetch: refetchBudget };
            }
            if (key[0] === 'getSquad') {
                return { data: squad, isLoading: false, refetch: refetchSquad };
            }
            return { isLoading: false, refetch: jest.fn() };
        });

        const { getByText } = renderWithProviders(<Team />);
        expect(
            getByText(
                'Recuerda estar en saldo positivo antes de empezar la jornada, sino no puntuarás',
            ),
        ).toBeTruthy();
    });

    it('useFocusEffect llama a refetchBudget y refetchSquad al montarse', () => {
        renderWithProviders(<Team />);
        expect(refetchBudget).toHaveBeenCalled();
        expect(refetchSquad).toHaveBeenCalled();
    });

    it('al pulsar un jugador: abre Alert, confirma "Si", llama sellPlayer y re‐refetch', async () => {
        const { getByText } = renderWithProviders(<Team />);

        fireEvent.press(getByText('Jugador 1'));

        expect(Alert.alert).toHaveBeenCalled();

        expect(sellPlayerFn).toHaveBeenCalled();
        const [vars] = sellPlayerFn.mock.calls[0];

        expect(vars).toEqual({
            idLiga: myGameLeague.idLiga,
            idLigaJuego: myGameLeague.idLigaJuego,
            idUsuario: user.uid,
            idJugador: 'J1',
        });

        await waitFor(() => {
            expect(refetchBudget).toHaveBeenCalledTimes(2);
            expect(refetchSquad).toHaveBeenCalledTimes(2);
        });
    });

    it('retorna null si budgetLoading o squadLoading = true', () => {
        useApiQuery.mockImplementation((key) => {
            if (key[0] === 'getBudget') {
                return { isLoading: true, refetch: refetchBudget };
            }
            if (key[0] === 'getSquad') {
                return { data: squad, isLoading: false, refetch: refetchSquad };
            }
            return { isLoading: false, refetch: jest.fn() };
        });

        const { queryByText } = renderWithProviders(<Team />);
        expect(queryByText(/Presupuesto/)).toBeNull();
    });
});
