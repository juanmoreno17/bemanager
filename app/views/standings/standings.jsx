import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { styles } from './standings.styles';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useApiQuery } from '../../api/hooks';
import { getStandings } from '../../api/urls/getStandings';
import { Button } from '../../components/button';

export const Standings = () => {
    const [itemList, setItemList] = useState([]);
    const [orderFlag, setOrderFlag] = useState('');
    const { myGameLeague } = useGameLeagueContext();

    const { isLoading: standingsLoading, refetch: refetchStandings } = useApiQuery(
        ['getStandings', myGameLeague.idLigaJuego, orderFlag],
        () => getStandings(myGameLeague.idLigaJuego, orderFlag),
        { enabled: false },
    );

    if (standingsLoading) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                    title="Jornada"
                    action={async () => {
                        //setItemList([]);
                        setOrderFlag('parcial');
                        const { data: standingsData } = await refetchStandings();
                        setItemList(standingsData?.data);
                    }}
                />
                <Button
                    title="Total"
                    action={async () => {
                        //setItemList([]);
                        setOrderFlag('total');
                        const { data: standingsData } = await refetchStandings();
                        setItemList(standingsData?.data);
                    }}
                />
            </View>
            <FlatList
                data={itemList}
                keyExtractor={(item) => item.idUsuario}
                renderItem={({ item }) => (
                    <View key={item.idUsuario} style={styles.render}>
                        <Text style={styles.text}>{item.nombreUsuario}</Text>
                        <Text style={styles.text}>
                            {orderFlag === 'parcial' ? item.puntuacion : item.puntuacionTotal}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};
