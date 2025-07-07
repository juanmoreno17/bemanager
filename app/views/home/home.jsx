import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './home.styles';
import { useUserContext } from '../../hooks/userContext';
import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { Button } from '../../components/button';
import { useApiMutation } from '../../api/hooks';
import { startGameLeague } from '../../api/urls/startGameLeague';
import { updateMarket } from '../../api/urls/updateMarket';
import { resolveBids } from '../../api/urls/resolveBids';
import { updateStandings } from '../../api/urls/updateStandings';
import { distributeRewards } from '../../api/urls/distributeRewards';

export const Home = () => {
    const { myGameLeague } = useGameLeagueContext();
    const { user } = useUserContext();

    const { mutate: startGameLeagueFn } = useApiMutation(
        startGameLeague,
        () => console.log('Game league started'),
        (err) => console.error({ err }),
    );

    const { mutate: updateMarketFn } = useApiMutation(
        updateMarket,
        () => console.log('Market updated'),
        (err) => console.error({ err }),
    );

    const { mutate: resolveBidsFn } = useApiMutation(
        resolveBids,
        () => console.log('Bids resolved'),
        (err) => console.error({ err }),
    );

    const { mutate: updateStandingsFn } = useApiMutation(
        updateStandings,
        () => console.log('Standings updated'),
        (err) => console.error({ err }),
    );

    const { mutate: distributeRewardsFn } = useApiMutation(
        distributeRewards,
        () => console.log('Rewards distributed'),
        (err) => console.error({ err }),
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Bienvenido a {myGameLeague.nombre}, {user.displayName}
            </Text>
            {user.uid === myGameLeague.propietario && (
                <>
                    <Text style={styles.title}>Panel de Administracion de la Liga</Text>
                    <Button
                        title="Empezar liga"
                        action={() => {
                            const leagueStarted = {
                                idLiga: myGameLeague.idLiga,
                                idLigaJuego: myGameLeague.idLigaJuego,
                            };
                            startGameLeagueFn(leagueStarted, {
                                onSuccess: (res) => {
                                    if (res?.message) {
                                        alert(res.message);
                                    }
                                },
                            });
                        }}
                    />
                    <Button
                        title="Actualizar mercado"
                        action={() => {
                            const marketUpdated = {
                                idLiga: myGameLeague.idLiga,
                                idLigaJuego: myGameLeague.idLigaJuego,
                            };
                            resolveBidsFn(myGameLeague.idLigaJuego, {
                                onSuccess: (res) => {
                                    if (res?.message) {
                                        alert(res.message);
                                    } else {
                                        updateMarketFn(marketUpdated, {
                                            onSuccess: (res) => {
                                                if (res?.message) {
                                                    alert(res.message);
                                                }
                                            },
                                        });
                                    }
                                },
                            });
                        }}
                    />
                    <Button
                        title="Actualizar clasificacion"
                        action={() => {
                            const leagueUpdated = {
                                idLiga: myGameLeague.idLiga,
                                idLigaJuego: myGameLeague.idLigaJuego,
                            };
                            updateStandingsFn(leagueUpdated, {
                                onSuccess: (res) => {
                                    if (res?.message) {
                                        alert(res.message);
                                    } else {
                                        distributeRewardsFn(myGameLeague.idLigaJuego);
                                    }
                                },
                            });
                        }}
                    />
                </>
            )}
        </View>
    );
};
