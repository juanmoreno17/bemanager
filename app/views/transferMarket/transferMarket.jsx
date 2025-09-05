import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, Text, Alert } from 'react-native';
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
    const [timeLeft, setTimeLeft] = useState('');

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
        }, [refetchBudget, refetchMarket]),
    );

    useEffect(() => {
        if (!marketData?.fechaActualizacion) return;
        const updateTimeLeft = () => {
            const nextUpdate = new Date(marketData.fechaActualizacion);
            nextUpdate.setHours(nextUpdate.getHours() + 24); // Sumar 24 horas a la fecha de actualización
            const now = new Date();
            const difference = nextUpdate - now;

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('Actualización en curso...');
            }
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [marketData?.fechaActualizacion]);

    const cleanStates = () => {
        setErrors({ bid: '' });
        setView(false);
        setPlayerId('');
        setPlayerValue(0);
        setBid('');
    };

    if (budgetLoading || marketLoading) {
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
                <Text style={styles.text2}>Próxima actualización del mercado en: {timeLeft}</Text>
            </View>
            <FlatList
                data={marketData?.data}
                keyExtractor={(item) => item.idJugador}
                renderItem={({ item }) => (
                    <PlayerItem
                        item={item}
                        showTouchable={true}
                        disabled={timeLeft === 'Actualización en curso...'}
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
                        placeholderTextColor: '#A9A9A9',
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
                                        Alert.alert('', res.message);
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
