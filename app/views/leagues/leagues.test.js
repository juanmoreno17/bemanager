import React from 'react';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Leagues } from './leagues';
import { useLeagues } from './leagues.hooks';
import { useUserContext } from '../../hooks/userContext';
import { useApiQuery } from '../../api/hooks';
import { getLeagues } from '../../api/urls/getLeagues';
import { getGameLeagues } from '../../api/urls/getGameLeagues';
import { getMyGameLeagues } from '../../api/urls/getMyGameLeagues';
import { renderWithProviders } from '../../../__tests__/utils/renderWithProviders';

jest.mock('./leagues.hooks');
jest.mock('../../hooks/userContext');
jest.mock('../../api/hooks');

const user = { uid: 'user-1', displayName: 'Tester' };

const leaguesResp = {
    data: [
        { idLiga: 'L1', nombre: 'Liga Uno' },
        { idLiga: 'L2', nombre: 'Liga Dos' },
    ],
};

const myGameLeaguesResp = {
    data: [
        { idLigaJuego: 'GL1', nombre: 'Mi Liga A' },
        { idLigaJuego: 'GL2', nombre: 'Mi Liga B' },
    ],
};

const handleCreateLeague = jest.fn();
const handleJoinLeague = jest.fn();
const renderItem = jest.fn(({ item }) => {
    const { Text } = require('react-native');
    return <Text>{item.nombre}</Text>;
});

const refetchLeagues = jest.fn();
const refetchGameLeagues = jest.fn();
const refetchMyGameLeagues = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();

    useUserContext.mockReturnValue({ user });

    useLeagues.mockReturnValue({
        handleCreateLeague,
        handleJoinLeague,
        renderItem,
    });

    useApiQuery.mockImplementation((key, fn) => {
        if (fn === getLeagues) {
            return { data: leaguesResp, isLoading: false, refetch: refetchLeagues };
        }
        if (fn === getGameLeagues) {
            return { isLoading: false, refetch: refetchGameLeagues };
        }
        if (
            fn === getMyGameLeagues ||
            (typeof fn === 'function' && String(fn).includes('getMyGameLeagues'))
        ) {
            return {
                data: myGameLeaguesResp,
                isLoading: false,
                refetch: refetchMyGameLeagues,
            };
        }
        return { isLoading: false, refetch: jest.fn() };
    });

    jest.spyOn(require('@react-navigation/native'), 'useFocusEffect').mockImplementation((cb) =>
        cb(),
    );
});

describe('Leagues', () => {
    it('renderiza título y mis ligas cuando no hay loading', () => {
        const { getByText } = renderWithProviders(<Leagues />);
        expect(getByText('Mis Ligas')).toBeTruthy();
        expect(getByText('Mi Liga A')).toBeTruthy();
        expect(getByText('Mi Liga B')).toBeTruthy();
    });

    it('dispara los refetch al montarse (useFocusEffect)', () => {
        renderWithProviders(<Leagues />);
        expect(refetchLeagues).toHaveBeenCalled();
        expect(refetchGameLeagues).toHaveBeenCalled();
        expect(refetchMyGameLeagues).toHaveBeenCalled();
    });

    it('abre "Crear liga", escribe nombre, selecciona Picker y llama handleCreateLeague con los argumentos correctos', async () => {
        const { getByText, getAllByTestId, getAllByText, UNSAFE_getByType } = renderWithProviders(
            <Leagues />,
        );

        // Abre el modal (primer botón "Crear liga")
        fireEvent.press(getByText('Crear liga'));

        // Escribe el nombre en el primer TextInput del modal
        const [nameInput] = getAllByTestId('text-input');
        fireEvent.changeText(nameInput, 'Liga Nueva');

        // Seleccionar en Picker (disparar onValueChange)
        const picker = UNSAFE_getByType(RNPicker);
        fireEvent(picker, 'valueChange', 'L2');

        // Pulsa el botón "Crear liga" del modal (segundo "Crear liga" en pantalla)
        const crearButtons = getAllByText('Crear liga');
        fireEvent.press(crearButtons[1]);

        expect(handleCreateLeague).toHaveBeenCalled();
        const args = handleCreateLeague.mock.calls[0];
        expect(args[0]).toBe('Liga Nueva'); // nameLeague
        expect(args[1]).toBe('L2'); // idLeague del Picker mock
        expect(args[2]).toEqual(user); // user
        expect(args[3]).toBe(refetchGameLeagues);
        expect(typeof args[4]).toBe('function'); // setErrors
        expect(typeof args[5]).toBe('function'); // cleanStates
    });

    it('abre "Unirse a liga", escribe código y llama handleJoinLeague con los argumentos correctos', async () => {
        const { getByText, getAllByTestId, getAllByText } = renderWithProviders(<Leagues />);

        // Abre el modal (primer botón "Unirse a liga")
        fireEvent.press(getByText('Unirse a liga'));

        // Escribe el código en el primer TextInput del modal
        const [codeInput] = getAllByTestId('text-input');
        fireEvent.changeText(codeInput, 'INV123');

        // Pulsa el botón "Unirse a liga" del modal (segundo en pantalla)
        const unirseButtons = getAllByText('Unirse a liga');
        fireEvent.press(unirseButtons[1]);

        expect(handleJoinLeague).toHaveBeenCalled();
        const args = handleJoinLeague.mock.calls[0];
        expect(args[0]).toBe('INV123'); // codeLeague
        expect(args[1]).toEqual(user); // user
        expect(args[2]).toBe(refetchGameLeagues);
        expect(args[3]).toBe(refetchMyGameLeagues);
        expect(typeof args[4]).toBe('function'); // setErrors
        expect(typeof args[5]).toBe('function'); // cleanStates
    });

    it('retorna null si alguna query está cargando', () => {
        useApiQuery.mockImplementation((key, fn) => {
            if (fn === getLeagues) {
                return { isLoading: true, refetch: refetchLeagues };
            }
            if (fn === getGameLeagues) {
                return { isLoading: false, refetch: refetchGameLeagues };
            }
            if (
                fn === getMyGameLeagues ||
                (typeof fn === 'function' && String(fn).includes('getMyGameLeagues'))
            ) {
                return { isLoading: false, data: myGameLeaguesResp, refetch: refetchMyGameLeagues };
            }
            return { isLoading: false, refetch: jest.fn() };
        });

        const { queryByText } = renderWithProviders(<Leagues />);
        expect(queryByText('Mis Ligas')).toBeNull();
    });
});
