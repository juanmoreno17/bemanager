import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Home } from './home';
import { Alert } from 'react-native';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';
import { useUserContext } from '../../hooks/userContext';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useApiMutation } from '../../api/hooks';
import { startGameLeague } from '../../api/urls/startGameLeague';
import { resolveBids } from '../../api/urls/resolveBids';
import { updateMarket } from '../../api/urls/updateMarket';
import { updateStandings } from '../../api/urls/updateStandings';
import { distributeRewards } from '../../api/urls/distributeRewards';

jest.mock('../../hooks/userContext', () => ({
    useUserContext: jest.fn(),
}));

jest.mock('../../hooks/gameLeagueContext', () => ({
    useGameLeagueContext: jest.fn(),
}));

jest.mock('../../api/hooks', () => ({
    __esModule: true,
    useApiMutation: jest.fn(),
}));

describe('Home', () => {
    const userOwner = { displayName: 'John', uid: '123' };
    const myGameLeague = { nombre: 'La Liga GPT', idLiga: 1, idLigaJuego: 2, propietario: '123' };
    const startGameLeagueMutate = jest.fn();
    const updateMarketMutate = jest.fn();
    const resolveBidsMutate = jest.fn();
    const updateStandingsMutate = jest.fn();
    const distributeRewardsMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Valores por defecto de los contextos
        useUserContext.mockReturnValue({ user: userOwner });
        useGameLeagueContext.mockReturnValue({ myGameLeague });

        jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

        useApiMutation.mockImplementation((fn) => {
            if (fn === startGameLeague) return { mutate: startGameLeagueMutate };
            if (fn === updateMarket) return { mutate: updateMarketMutate };
            if (fn === resolveBids) return { mutate: resolveBidsMutate };
            if (fn === updateStandings) return { mutate: updateStandingsMutate };
            if (fn === distributeRewards) return { mutate: distributeRewardsMutate };
            return { mutate: jest.fn() };
        });
    });

    it('renderiza el panel admin para el propietario y los botones', () => {
        // No necesitamos comportamiento especial de mutate para este test
        const { getByText } = renderWithProviders(<Home />);

        expect(
            getByText(`Bienvenido a ${myGameLeague.nombre}, ${userOwner.displayName}`),
        ).toBeTruthy();
        expect(getByText('Panel de Administracion de la Liga')).toBeTruthy();
        expect(getByText('Empezar liga')).toBeTruthy();
        expect(getByText('Actualizar mercado')).toBeTruthy();
        expect(getByText('Actualizar clasificacion')).toBeTruthy();
    });

    it('“Empezar liga” llama a startGameLeague y muestra Alert si hay message', () => {
        startGameLeagueMutate.mockImplementation((vars, opts) => {
            // comprobamos argumentos y disparamos onSuccess con message
            expect(vars).toEqual({ idLiga: 1, idLigaJuego: 2 });
            opts?.onSuccess?.({ message: 'Liga iniciada' });
        });

        const { getByText } = renderWithProviders(<Home />);
        fireEvent.press(getByText('Empezar liga'));

        expect(startGameLeagueMutate).toHaveBeenCalledWith(
            { idLiga: 1, idLigaJuego: 2 },
            expect.objectContaining({ onSuccess: expect.any(Function) }),
        );
        expect(Alert.alert).toHaveBeenCalledWith('', 'Liga iniciada');
    });

    it('“Actualizar mercado”: si resolveBids devuelve message, no llama a updateMarket y alerta', () => {
        resolveBidsMutate.mockImplementation((idLigaJuego, opts) => {
            expect(idLigaJuego).toBe(2);
            opts?.onSuccess?.({ message: 'Pujas ya resueltas' });
        });

        const { getByText } = renderWithProviders(<Home />);
        fireEvent.press(getByText('Actualizar mercado'));

        expect(resolveBidsMutate).toHaveBeenCalledWith(2, expect.any(Object));
        expect(updateMarketMutate).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('', 'Pujas ya resueltas');
    });

    it('“Actualizar mercado”: si resolveBids NO trae message, llama a updateMarket y alerta su message si existe', () => {
        resolveBidsMutate.mockImplementation((_idLigaJuego, opts) => {
            // Sin message → debe encadenar a updateMarket
            opts?.onSuccess?.({});
        });
        updateMarketMutate.mockImplementation((vars, opts) => {
            expect(vars).toEqual({ idLiga: 1, idLigaJuego: 2 });
            opts?.onSuccess?.({ message: 'Mercado actualizado' });
        });

        const { getByText } = renderWithProviders(<Home />);
        fireEvent.press(getByText('Actualizar mercado'));

        expect(resolveBidsMutate).toHaveBeenCalledWith(2, expect.any(Object));
        expect(updateMarketMutate).toHaveBeenCalledWith(
            { idLiga: 1, idLigaJuego: 2 },
            expect.objectContaining({ onSuccess: expect.any(Function) }),
        );
        expect(Alert.alert).toHaveBeenCalledWith('', 'Mercado actualizado');
    });

    it('“Actualizar clasificacion”: si updateStandings NO trae message, llama a distributeRewards con idLigaJuego', () => {
        updateStandingsMutate.mockImplementation((vars, opts) => {
            expect(vars).toEqual({ idLiga: 1, idLigaJuego: 2 });
            // Sin message → debe llamar a distributeRewards
            opts?.onSuccess?.({});
        });

        const { getByText } = renderWithProviders(<Home />);
        fireEvent.press(getByText('Actualizar clasificacion'));

        expect(updateStandingsMutate).toHaveBeenCalledWith(
            { idLiga: 1, idLigaJuego: 2 },
            expect.any(Object),
        );
        expect(distributeRewardsMutate).toHaveBeenCalledWith(2);
    });

    it('“Actualizar clasificacion”: si updateStandings devuelve message, alerta y NO llama a distributeRewards', () => {
        updateStandingsMutate.mockImplementation((vars, opts) => {
            expect(vars).toEqual({ idLiga: 1, idLigaJuego: 2 });
            opts?.onSuccess?.({ message: 'Clasificación actualizada' });
        });

        const { getByText } = renderWithProviders(<Home />);
        fireEvent.press(getByText('Actualizar clasificacion'));

        expect(Alert.alert).toHaveBeenCalledWith('', 'Clasificación actualizada');
        expect(distributeRewardsMutate).not.toHaveBeenCalled();
    });

    it('si el usuario NO es propietario, no muestra el panel admin', () => {
        useUserContext.mockReturnValueOnce({ user: { uid: 'other', displayName: 'NoOwner' } });
        const { queryByText } = renderWithProviders(<Home />);
        expect(queryByText('Panel de Administracion de la Liga')).toBeNull();
    });
});
