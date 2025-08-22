import { renderHook, act } from '@testing-library/react-hooks';
import { UserProvider, useUserContext } from './userContext';

describe('UserContext', () => {
    it('provides the default value of user as null', () => {
        const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
        const { result } = renderHook(() => useUserContext(), { wrapper });

        expect(result.current.user).toBeNull();
    });

    it('updates user when setUser is called', () => {
        const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
        const { result } = renderHook(() => useUserContext(), { wrapper });

        act(() => {
            result.current.setUser({ id: 1, name: 'John Doe' });
        });

        expect(result.current.user).toEqual({ id: 1, name: 'John Doe' });
    });

    it('allows setting user to null', () => {
        const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
        const { result } = renderHook(() => useUserContext(), { wrapper });

        act(() => {
            result.current.setUser({ id: 1, name: 'John Doe' });
        });

        act(() => {
            result.current.setUser(null);
        });

        expect(result.current.user).toBeNull();
    });
});
