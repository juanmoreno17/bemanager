import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, Text } from 'react-native';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useUserContext } from '../../hooks/userContext';
import { useApiQuery } from '../../api/hooks';
import { useApiMutation } from '../../api/hooks';
import { getBudget } from '../../api/urls/getBudget';
import { getMarket } from '../../api/urls/getMarket';
import { makeBid } from '../../api/urls/makeBid';
import { styles } from './transferMarket.styles';
import { PlayerItem } from '../../components/playerItem';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { ModalCustom } from '../../components/modal';

export const TransferMarket = () => {
    const { myGameLeague } = useGameLeagueContext();
    const { user } = useUserContext();
    const [playerId, setPlayerId] = useState('');
    const [playerValue, setPlayerValue] = useState(0);
    const [bid, setBid] = useState('');
    const [errors, setErrors] = useState({ bid: '' });
    const [view, setView] = useState(false);

    const {
        data: budgetData,
        isLoading: budgetLoading,
        refetch: refetchBudget,
    } = useApiQuery(['getBudget', myGameLeague.idLigaJuego, user.uid], () =>
        getBudget(myGameLeague.idLigaJuego, user.uid),
    );

    const {
        data: marketData,
        isLoading: marketLoading,
        refetch: refetchMarket,
    } = useApiQuery(['getMarket', myGameLeague.idLiga, myGameLeague.idLigaJuego], () =>
        getMarket(myGameLeague.idLiga, myGameLeague.idLigaJuego),
    );

    const { mutate: makeBidFn } = useApiMutation(
        makeBid,
        () => console.log('Bid made successfully'),
        (err) => console.error({ err }),
    );

    useFocusEffect(
        React.useCallback(() => {
            refetchBudget();
            refetchMarket();
        }, []),
    );

    if (budgetLoading || marketLoading) {
        return null;
    }

    const cleanStates = () => {
        setErrors({ bid: '' });
        setView(false);
        setPlayerId('');
        setPlayerValue(0);
        setBid('');
    };

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
                data={marketData.data}
                keyExtractor={(item) => item.idJugador}
                renderItem={({ item }) => (
                    <PlayerItem
                        item={item}
                        action={() => {
                            setPlayerId(item.idJugador);
                            setPlayerValue(item.valor);
                            setView(true);
                        }}
                    />
                )}
            />
            <ModalCustom visible={view} onClose={() => cleanStates()}>
                <Input
                    title="Valor de la puja"
                    custom={{
                        value: String(bid),
                        placeholder:
                            'Valor min: ' +
                            playerValue.toLocaleString('es-ES') +
                            '€ / Valor max: ' +
                            (playerValue * 1.5).toLocaleString('es-ES') +
                            '€',
                        onChangeText: (bid) => {
                            setBid(Number(bid));
                            setErrors((_errors) => ({ ..._errors, bid: '' }));
                        },
                    }}
                />
                {errors.bid ? <Text style={styles.errorLabel}>{errors.bid}</Text> : null}
                <Button
                    title="Hacer puja"
                    action={() => {
                        if (!bid) {
                            setErrors((_errors) => ({
                                bid: 'El valor de la puja no puede estar vacío',
                            }));
                        } else if (isNaN(bid) || bid <= 0) {
                            setErrors((_errors) => ({
                                bid: 'El valor de la puja debe ser un número positivo',
                            }));
                        } else if (bid < playerValue) {
                            setErrors((_errors) => ({
                                bid: 'El valor de la puja debe ser mayor o igual al valor del jugador',
                            }));
                        } else if (bid > playerValue * 1.5) {
                            setErrors((_errors) => ({
                                bid: 'El valor de la puja no puede ser mayor al 150% del valor del jugador',
                            }));
                        } else {
                            const playerBid = {
                                idLigaJuego: myGameLeague.idLigaJuego,
                                idJugador: playerId,
                                idPujador: user.uid,
                                bidValue: bid,
                            };
                            makeBidFn(playerBid, {
                                onSuccess: (res) => {
                                    if (res?.message) {
                                        alert(res.message);
                                    } else {
                                        cleanStates();
                                    }
                                },
                            });
                        }
                    }}
                />
            </ModalCustom>
        </View>
    );
};
