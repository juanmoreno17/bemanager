import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { styles } from './information.styles';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useApiQuery } from '../../api/hooks';
import { useApiMutation } from '../../api/hooks';
import { getPlayers } from '../../api/urls/getPlayers';
import { getTeams } from '../../api/urls/getTeams';
import { ModalCustom } from '../../components/modal';
import { useInformation } from './information.hooks';
import { PlayerItem } from '../../components/playerItem';

export const Information = () => {
    const [itemList, setItemList] = useState([]);
    const { myGameLeague } = useGameLeagueContext();
    const [view, setView] = useState(false);

    const { renderTeams } = useInformation();

    const { mutateAsync: getTeamPlayers } = useApiMutation(
        getPlayers,
        () => console.log('Players refetched'),
        (err) => console.error({ err }),
    );

    const { data: teamsData, isLoading: teamsLoading } = useApiQuery(
        ['getTeams', myGameLeague.idLiga],
        () => getTeams(myGameLeague.idLiga),
    );

    if (teamsLoading) return null; // or a loading indicator

    const cleanStates = () => {
        setItemList([]);
        setView(false);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={teamsData.data}
                keyExtractor={(item) => item.idEquipo}
                renderItem={({ item }) =>
                    renderTeams({
                        item,
                        action: async () => {
                            const response = await getTeamPlayers({
                                idLiga: myGameLeague.idLiga,
                                idEquipo: item.idEquipo,
                            });
                            setItemList(response.data);
                            setView(true);
                        },
                    })
                }
            />
            <ModalCustom visible={view} onClose={() => cleanStates()}>
                <FlatList
                    data={itemList}
                    keyExtractor={(item) => item.idJugador}
                    renderItem={({ item }) => <PlayerItem item={item} />}
                />
            </ModalCustom>
        </View>
    );
};
