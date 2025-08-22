import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PlayerItem } from './index';

describe('PlayerItem', () => {
    it('renders player details correctly', () => {
        const item = {
            idJugador: '1',
            escudoEquipo: 'https://example.com/escudo.png',
            foto: 'https://example.com/foto.png',
            nombre: 'Player Name',
            valor: 1000000,
            estado: 'Activo',
            puntuacionTotal: 50,
            posicion: 'Delantero',
        };
        const { getByText } = render(
            <PlayerItem item={item} showTouchable={false} showSellButton={false} />,
        );
        expect(getByText('Player Name')).toBeTruthy();
        expect(getByText('1.000.000 €')).toBeTruthy();
        expect(getByText('Activo')).toBeTruthy();
        expect(getByText('50')).toBeTruthy();
    });

    it('renders sell button when showSellButton is true', () => {
        const item = {
            idJugador: '1',
            escudoEquipo: 'https://example.com/escudo.png',
            foto: 'https://example.com/foto.png',
            nombre: 'Player Name',
            valor: 1000000,
            estado: 'Activo',
            puntuacionTotal: 50,
            posicion: 'Delantero',
        };
        const { getByText } = render(
            <PlayerItem
                item={item}
                showTouchable={false}
                showSellButton={true}
                action={() => {}}
            />,
        );
        expect(getByText('Vender')).toBeTruthy();
    });

    it('calls action when sell button is pressed', () => {
        const item = {
            idJugador: '1',
            escudoEquipo: 'https://example.com/escudo.png',
            foto: 'https://example.com/foto.png',
            nombre: 'Player Name',
            valor: 1000000,
            estado: 'Activo',
            puntuacionTotal: 50,
            posicion: 'Delantero',
        };
        const mockAction = jest.fn();
        const { getByText } = render(
            <PlayerItem
                item={item}
                showTouchable={false}
                showSellButton={true}
                action={mockAction}
            />,
        );
        fireEvent.press(getByText('Vender'));
        expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('renders TouchableOpacity when showTouchable is true', () => {
        const item = {
            idJugador: '1',
            escudoEquipo: 'https://example.com/escudo.png',
            foto: 'https://example.com/foto.png',
            nombre: 'Player Name',
            valor: 1000000,
            estado: 'Activo',
            puntuacionTotal: 50,
            posicion: 'Delantero',
        };
        const { getByTestId } = render(
            <PlayerItem item={item} showTouchable={true} action={() => {}} />,
        );
        expect(getByTestId('TouchableOpacity')).toBeTruthy();
    });

    it('does not call action when TouchableOpacity is disabled', () => {
        const item = {
            idJugador: '1',
            escudoEquipo: 'https://example.com/escudo.png',
            foto: 'https://example.com/foto.png',
            nombre: 'Player Name',
            valor: 1000000,
            estado: 'Activo',
            puntuacionTotal: 50,
            posicion: 'Delantero',
        };
        const mockAction = jest.fn();
        const { getByTestId } = render(
            <PlayerItem item={item} showTouchable={true} action={mockAction} disabled={true} />,
        );
        fireEvent.press(getByTestId('TouchableOpacity'));
        expect(mockAction).not.toHaveBeenCalled();
    });
});
