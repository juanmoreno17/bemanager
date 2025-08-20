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
    const [title, setTitle] = useState('');
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
            <Button
                title="Jornada"
                action={async () => {
                    await new Promise((resolve) => {
                        setOrderFlag('parcial');
                        resolve();
                    });
                    setTitle('Clasificación Jornada');
                    const { data: standingsData } = await refetchStandings();
                    setItemList(standingsData?.data);
                }}
            />
            <Button
                title="Total"
                action={async () => {
                    await new Promise((resolve) => {
                        setOrderFlag('total');
                        resolve();
                    });
                    setTitle('Clasificación Total');
                    const { data: standingsData } = await refetchStandings();
                    setItemList(standingsData?.data);
                }}
            />
            <View style={styles.header}>
                <Text style={styles.text2}>{title}</Text>
                <FlatList
                    data={itemList}
                    keyExtractor={(item) => item.idUsuario}
                    renderItem={({ item }) => (
                        <View key={item.idUsuario} style={styles.render}>
                            <Text style={styles.text}>{item.nombreUsuario}</Text>
                            <Text style={styles.text}>
                                {(orderFlag === 'parcial'
                                    ? item.puntuacion
                                    : item.puntuacionTotal
                                ).toLocaleString('es-ES', { minimumFractionDigits: 1 })}{' '}
                                puntos
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};
