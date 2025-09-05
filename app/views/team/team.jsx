import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, Text, Alert } from 'react-native';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useUserContext } from '../../hooks/userContext';
import { useApiQuery } from '../../api/hooks';
import { useApiMutation } from '../../api/hooks';
import { sellPlayer } from '../../api/urls/sellPlayer';
import { getBudget } from '../../api/urls/getBudget';
import { getSquad } from '../../api/urls/getSquad';
import { PlayerItem } from '../../components/playerItem';
import { styles } from './team.styles';

export const Team = () => {
    const { myGameLeague } = useGameLeagueContext();
    const { user } = useUserContext();

    const {
        data: budgetData,
        isLoading: budgetLoading,
        refetch: refetchBudget,
    } = useApiQuery(['getBudget', myGameLeague.idLigaJuego, user.uid], () =>
        getBudget(myGameLeague.idLigaJuego, user.uid),
    );

    const {
        data: squadData,
        isLoading: squadLoading,
        refetch: refetchSquad,
    } = useApiQuery(['getSquad', myGameLeague.idLiga, myGameLeague.idLigaJuego, user.uid], () =>
        getSquad(myGameLeague.idLiga, myGameLeague.idLigaJuego, user.uid),
    );

    const { mutate: sellPlayerFn } = useApiMutation(
        sellPlayer,
        () => console.log('Player sold'),
        (err) => console.error({ err }),
    );

    useFocusEffect(
        React.useCallback(() => {
            refetchBudget();
            refetchSquad();
        }, []),
    );

    if (budgetLoading || squadLoading) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text2}>
                    Presupuesto: {budgetData.data.toLocaleString('es-ES')} €
                </Text>
                {budgetData.data < 0 && (
                    <Text style={styles.warning}>
                        Recuerda estar en saldo positivo antes de empezar la jornada, sino no
                        puntuarás
                    </Text>
                )}
            </View>
            <FlatList
                data={squadData?.data}
                keyExtractor={(item) => item.idJugador}
                renderItem={({ item }) => (
                    <PlayerItem
                        item={item}
                        showSellButton={true}
                        action={() => {
                            Alert.alert('', '¿Seguro que quieres vender a este jugador?', [
                                {
                                    text: 'Si',
                                    onPress: () => {
                                        const playerSold = {
                                            idLiga: myGameLeague.idLiga,
                                            idLigaJuego: myGameLeague.idLigaJuego,
                                            idUsuario: user.uid,
                                            idJugador: item.idJugador,
                                        };
                                        sellPlayerFn(playerSold, {
                                            onSuccess: () => {
                                                refetchBudget();
                                                refetchSquad();
                                            },
                                        });
                                    },
                                },
                                {
                                    text: 'No',
                                    style: 'cancel',
                                },
                            ]);
                        }}
                    />
                )}
            />
        </View>
    );
};
