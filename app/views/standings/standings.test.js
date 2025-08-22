// app/views/standings/standings.test.js

// --- Mocks: SIEMPRE antes de importar el componente ---
jest.mock('../../hooks/gameLeagueContext', () => ({
    useGameLeagueContext: jest.fn(),
}));

jest.mock('../../api/hooks', () => ({
    __esModule: true,
    useApiQuery: jest.fn(),
}));

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { Standings } from './standings';

import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useApiQuery } from '../../api/hooks';

describe('Standings', () => {
    const myGameLeague = { idLigaJuego: 'GL-123' };

    // Datos simulados devueltos por refetchStandings()
    const refetchPayloadParcial = {
        data: {
            data: [
                {
                    idUsuario: 'U1',
                    nombreUsuario: 'Alice',
                    puntuacion: 10.5,
                    puntuacionTotal: 100.2,
                },
                { idUsuario: 'U2', nombreUsuario: 'Bob', puntuacion: 7.0, puntuacionTotal: 77.3 },
            ],
        },
    };

    const refetchPayloadTotal = {
        data: {
            data: [
                {
                    idUsuario: 'U1',
                    nombreUsuario: 'Alice',
                    puntuacion: 10.5,
                    puntuacionTotal: 100.2,
                },
                { idUsuario: 'U2', nombreUsuario: 'Bob', puntuacion: 7.0, puntuacionTotal: 77.3 },
            ],
        },
    };

    const refetchStandings = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Contexto de liga
        useGameLeagueContext.mockReturnValue({ myGameLeague });

        // Por defecto: no loading y con refetch configurado (el payload lo iremos cambiando por test)
        useApiQuery.mockReturnValue({
            isLoading: false,
            refetch: refetchStandings,
        });
    });

    it('muestra los botones Jornada y Total cuando no hay loading', () => {
        const { getByText } = renderWithProviders(<Standings />);
        expect(getByText('Jornada')).toBeTruthy();
        expect(getByText('Total')).toBeTruthy();
    });

    it('flujo "Jornada": fija título, llama refetch y renderiza puntuación parcial', async () => {
        // refetch devuelve las puntuaciones “parciales”
        refetchStandings.mockResolvedValueOnce(refetchPayloadParcial);

        const { getByText, queryByText } = renderWithProviders(<Standings />);

        // Inicialmente no hay título ni lista
        expect(queryByText('Clasificación Jornada')).toBeNull();

        // Pulsar "Jornada"
        fireEvent.press(getByText('Jornada'));

        // Esperar a que setee título y pinte lista con puntuación parcial
        await waitFor(() => {
            expect(getByText('Clasificación Jornada')).toBeTruthy();

            // Nombres
            expect(getByText('Alice')).toBeTruthy();
            expect(getByText('Bob')).toBeTruthy();

            // Puntuaciones parciales formateadas (admitimos coma o punto decimal)
            expect(getByText(/10[.,]5 puntos/)).toBeTruthy();
            expect(getByText(/7[.,]0? puntos/)).toBeTruthy(); // 7 o 7.0 según formato
        });

        // refetch fue llamado
        expect(refetchStandings).toHaveBeenCalledTimes(1);
    });

    it('flujo "Total": fija título, llama refetch y renderiza puntuación total', async () => {
        // refetch devuelve las puntuaciones “totales”
        refetchStandings.mockResolvedValueOnce(refetchPayloadTotal);

        const { getByText, queryByText } = renderWithProviders(<Standings />);

        expect(queryByText('Clasificación Total')).toBeNull();

        // Pulsar "Total"
        fireEvent.press(getByText('Total'));

        await waitFor(() => {
            expect(getByText('Clasificación Total')).toBeTruthy();

            // Nombres
            expect(getByText('Alice')).toBeTruthy();
            expect(getByText('Bob')).toBeTruthy();

            // Puntuaciones totales formateadas
            expect(getByText(/100[.,]2 puntos/)).toBeTruthy();
            expect(getByText(/77[.,]3 puntos/)).toBeTruthy();
        });

        expect(refetchStandings).toHaveBeenCalledTimes(1);
    });

    it('retorna null si standingsLoading=true', () => {
        useApiQuery.mockReturnValueOnce({
            isLoading: true,
            refetch: jest.fn(),
        });

        const { queryByText } = renderWithProviders(<Standings />);
        expect(queryByText('Jornada')).toBeNull();
        expect(queryByText('Total')).toBeNull();
    });
});
