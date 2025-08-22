import { renderHook, act } from '@testing-library/react-hooks';
import { GameLeagueProvider, useGameLeagueContext } from './gameLeagueContext';

describe('GameLeagueContext', () => {
    it('provides the default value of myGameLeague as null', () => {
        const wrapper = ({ children }) => <GameLeagueProvider>{children}</GameLeagueProvider>;
        const { result } = renderHook(() => useGameLeagueContext(), { wrapper });

        expect(result.current.myGameLeague).toBeNull();
    });

    it('updates myGameLeague when setMyGameLeague is called', () => {
        const wrapper = ({ children }) => <GameLeagueProvider>{children}</GameLeagueProvider>;
        const { result } = renderHook(() => useGameLeagueContext(), { wrapper });

        act(() => {
            result.current.setMyGameLeague('newGameLeague');
        });

        expect(result.current.myGameLeague).toBe('newGameLeague');
    });
});
