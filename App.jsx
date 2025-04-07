import 'react-native-gesture-handler';
import React from 'react';
import { AppStack } from './app/navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppStack />
        </QueryClientProvider>
    );
}
