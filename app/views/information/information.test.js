// app/views/information/information.test.js
import React from 'react';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Information } from './information';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useApiQuery, useApiMutation } from '../../api/hooks';
import { useInformation } from './information.hooks';

// ── Mocks de hooks usados dentro del componente ────────────────────────────────
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

// ── Componente hijo que se usa en el modal: lo simplificamos para asertar fácil ─
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

    // mock mutación asíncrona que devuelve los jugadores del equipo pulsado
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

        // Contexto de la liga
        useGameLeagueContext.mockReturnValue({ myGameLeague });

        // Hook de render de equipos: devolvemos un item presionable con el nombre del equipo
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

        // Query de equipos: por defecto, NO loading y datos disponibles
        useApiQuery.mockReturnValue({
            data: teamsApiResponse,
            isLoading: false,
        });

        // Mutación (getPlayers): devolvemos mutateAsync
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

        // Aún no hay jugadores en pantalla
        expect(queryByText(/Jugador A de/)).toBeNull();

        // Pulsa "Equipo Uno" -> dispara action que llama mutateAsync y abre el modal
        fireEvent.press(getByText('Equipo Uno'));

        // Espera a que se haya llamado la mutación con los parámetros correctos
        await waitFor(() =>
            expect(mutateAsyncMock).toHaveBeenCalledWith({
                idLiga: 99,
                idEquipo: 'E1',
            }),
        );

        // Y a que se muestren los jugadores en el modal (ModalCustom del helper renderiza hijos si visible)
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
