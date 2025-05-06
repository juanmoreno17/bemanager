import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../components/button';
import { Input } from '../../components/input';

export const JoinLeague = ({ navigation }) => {
    const [leagueCode, setLeagueCode] = useState('');
    const [error, setError] = useState(null);

    const handleJoinLeague = () => {
        if (leagueCode.trim() === '') {
            setError('Please enter a league code');
            return;
        }
        // Assuming you have a function to join the league
        joinLeague(leagueCode)
            .then(() => {
                navigation.navigate('Home');
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join a League</Text>
            <Input
                title="League Code"
                custom={{
                    value: leagueCode,
                    onChangeText: (text) => setLeagueCode(text),
                }}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Join" action={handleJoinLeague} />
        </View>
    );
};
