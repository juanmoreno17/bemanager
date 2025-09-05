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
        useGameLeagueContext.mockReturnValue({ myGameLeague });
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
        refetchStandings.mockResolvedValueOnce(refetchPayloadParcial);

        const { getByText, queryByText } = renderWithProviders(<Standings />);

        expect(queryByText('Clasificación Jornada')).toBeNull();

        fireEvent.press(getByText('Jornada'));

        await waitFor(() => {
            expect(getByText('Clasificación Jornada')).toBeTruthy();

            expect(getByText('Alice')).toBeTruthy();
            expect(getByText('Bob')).toBeTruthy();

            expect(getByText(/10[.,]5 puntos/)).toBeTruthy();
            expect(getByText(/7[.,]0? puntos/)).toBeTruthy();
        });

        expect(refetchStandings).toHaveBeenCalledTimes(1);
    });

    it('flujo "Total": fija título, llama refetch y renderiza puntuación total', async () => {
        refetchStandings.mockResolvedValueOnce(refetchPayloadTotal);

        const { getByText, queryByText } = renderWithProviders(<Standings />);

        expect(queryByText('Clasificación Total')).toBeNull();

        fireEvent.press(getByText('Total'));

        await waitFor(() => {
            expect(getByText('Clasificación Total')).toBeTruthy();

            expect(getByText('Alice')).toBeTruthy();
            expect(getByText('Bob')).toBeTruthy();

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
