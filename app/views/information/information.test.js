import React from 'react';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Information } from './information';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useApiQuery, useApiMutation } from '../../api/hooks';
import { useInformation } from './information.hooks';

jest.mock('../../hooks/gameLeagueContext', () => ({
    useGameLeagueContext: jest.fn(),
}));
jest.mock('../../api/hooks', () => ({
    __esModule: true,
    useApiQuery: jest.fn(),
    useApiMutation: jest.fn(),
}));
jest.mock('./information.hooks', () => ({
    useInformation: jest.fn(),
}));

jest.mock('../../components/playerItem', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        PlayerItem: ({ item }) => <Text>{item.nombre}</Text>,
    };
});

describe('Information', () => {
    const myGameLeague = { idLiga: 99, nombre: 'Liga Test' };

    const teamsApiResponse = {
        data: [
            { idEquipo: 'E1', nombre: 'Equipo Uno' },
            { idEquipo: 'E2', nombre: 'Equipo Dos' },
        ],
    };

    const mutateAsyncMock = jest.fn(async ({ idLiga, idEquipo }) => {
        if (idLiga !== 99) throw new Error('Liga incorrecta');
        return {
            data: [
                { idJugador: 'J1', nombre: `Jugador A de ${idEquipo}` },
                { idJugador: 'J2', nombre: `Jugador B de ${idEquipo}` },
            ],
        };
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useGameLeagueContext.mockReturnValue({ myGameLeague });
        useInformation.mockReturnValue({
            renderTeams: ({ item, action }) => {
                const { Text } = require('react-native');
                return (
                    <Text onPress={action} accessibilityRole="button">
                        {item.nombre}
                    </Text>
                );
            },
        });
        useApiQuery.mockReturnValue({
            data: teamsApiResponse,
            isLoading: false,
        });
        useApiMutation.mockReturnValue({
            mutateAsync: mutateAsyncMock,
        });
    });

    it('muestra la lista de equipos cuando la query no está cargando', () => {
        const { getByText } = renderWithProviders(<Information />);

        expect(getByText('Equipo Uno')).toBeTruthy();
        expect(getByText('Equipo Dos')).toBeTruthy();
    });

    it('cuando se pulsa un equipo, carga jugadores (mutateAsync) y los muestra en el modal', async () => {
        const { getByText, queryByText } = renderWithProviders(<Information />);

        expect(queryByText(/Jugador A de/)).toBeNull();

        fireEvent.press(getByText('Equipo Uno'));

        await waitFor(() =>
            expect(mutateAsyncMock).toHaveBeenCalledWith({
                idLiga: 99,
                idEquipo: 'E1',
            }),
        );

        await waitFor(() => {
            expect(getByText('Jugador A de E1')).toBeTruthy();
            expect(getByText('Jugador B de E1')).toBeTruthy();
        });
    });

    it('si isLoading=true, no renderiza la lista (retorna null)', () => {
        useApiQuery.mockReturnValueOnce({
            data: undefined,
            isLoading: true,
        });

        const { queryByText } = renderWithProviders(<Information />);
        expect(queryByText('Equipo Uno')).toBeNull();
        expect(queryByText('Equipo Dos')).toBeNull();
    });
});
