import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { styles } from './information.styles';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useApiQuery } from '../../api/hooks';
import { getPlayers } from '../../api/urls/getPlayers';
import { getTeams } from '../../api/urls/getTeams';
import { Button } from '../../components/button';
import { ModalCustom } from '../../components/modal';
import { useInformation } from './information.hooks';

export const Information = () => {
    const [itemList, setItemList] = useState([]);
    const { myGameLeague } = useGameLeagueContext();
    const [lastVisible, setLastVisible] = useState(null);
    const [view, setView] = useState(false);
    const [view2, setView2] = useState(false);

    const { loadPlayers, renderTeams, renderPlayers } = useInformation();

    const { isLoading: playersLoading, refetch: refetchPlayers } = useApiQuery(
        ['getPlayers', myGameLeague.idLiga, lastVisible],
        () => getPlayers(myGameLeague.idLiga, lastVisible),
        { enabled: false },
    );

    const { data: teamsData, isLoading: teamsLoading } = useApiQuery(
        ['getTeams', myGameLeague.idLiga],
        () => getTeams(myGameLeague.idLiga),
    );

    if (teamsLoading) return null; // or a loading indicator

    return (
        <View style={styles.container}>
            <Button
                title="Jugadores"
                action={() => {
                    loadPlayers(refetchPlayers, setItemList, setLastVisible);
                    setView(true);
                }}
            />
            <Button title="Equipos" action={() => setView2(true)} />
            <ModalCustom visible={view2} onClose={() => setView2(false)}>
                <FlatList
                    data={teamsData.data}
                    keyExtractor={(item) => item.idEquipo}
                    renderItem={(item) => renderTeams(item)}
                />
            </ModalCustom>
            <ModalCustom visible={view} onClose={() => setView(false)}>
                <FlatList
                    data={itemList}
                    keyExtractor={(item) => item.idJugador}
                    renderItem={(item) => renderPlayers(item)}
                    onEndReached={() => loadPlayers(refetchPlayers, setItemList, setLastVisible)}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={playersLoading ? <Text>Cargando...</Text> : null}
                />
            </ModalCustom>
        </View>
    );
};
