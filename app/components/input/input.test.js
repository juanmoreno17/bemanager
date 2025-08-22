import React from 'react';
import { render } from '@testing-library/react-native';
import { Input } from './index';

describe('Input', () => {
    it('renders the title correctly', () => {
        const { getByText } = render(<Input title="Username" custom={{}} value="" />);
        expect(getByText('Username')).toBeTruthy();
    });

    it('renders the TextInput with the correct value', () => {
        const { getByDisplayValue } = render(
            <Input title="Email" custom={{}} value="test@example.com" />,
        );
        expect(getByDisplayValue('test@example.com')).toBeTruthy();
    });

    it('renders correctly when no title is provided', () => {
        const { queryByText } = render(<Input custom={{}} value="No Title" />);
        expect(queryByText('Username')).toBeNull();
    });

    it('renders correctly when no value is provided', () => {
        const { getByTestId } = render(<Input title="Password" custom={{}} />);
        expect(getByTestId('text-input')).toBeTruthy();
    });

    it('applies custom props to the TextInput', () => {
        const { getByPlaceholderText } = render(
            <Input title="Search" custom={{ placeholder: 'Type here' }} value="" />,
        );
        expect(getByPlaceholderText('Type here')).toBeTruthy();
    });
});
