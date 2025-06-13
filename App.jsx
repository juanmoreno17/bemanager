import 'react-native-gesture-handler';
import React from 'react';
import { AppStack } from './app/navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './app/hooks/userContext';
import { GameLeagueProvider } from './app/hooks/gameLeagueContext';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <GameLeagueProvider>
                    <AppStack />
                </GameLeagueProvider>
            </UserProvider>
        </QueryClientProvider>
    );
}
