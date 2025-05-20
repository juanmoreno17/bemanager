import 'react-native-gesture-handler';
import React from 'react';
import { AppStack } from './app/navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyProvider } from './app/hooks/myContext';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <MyProvider>
                <AppStack />
            </MyProvider>
        </QueryClientProvider>
    );
}
