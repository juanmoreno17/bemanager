import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './index';

describe('Button', () => {
    it('renders the title correctly', () => {
        const { getByText } = render(<Button title="Click Me" action={() => {}} />);
        expect(getByText('Click Me')).toBeTruthy();
    });

    it('calls the action when pressed', () => {
        const mockAction = jest.fn();
        const { getByText } = render(<Button title="Press Me" action={mockAction} />);
        fireEvent.press(getByText('Press Me'));
        expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('does not throw an error if no action is provided', () => {
        const { getByText } = render(<Button title="No Action" />);
        expect(() => fireEvent.press(getByText('No Action'))).not.toThrow();
    });

    it('renders correctly with an empty title', () => {
        const { getByTestId } = render(<Button title="" action={() => {}} />);
        expect(getByTestId('button')).toBeTruthy();
    });
});
