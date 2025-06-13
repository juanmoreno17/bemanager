import { useGameLeagueContext } from '../../hooks/gameLeagueContext';
import { useNavigation } from '@react-navigation/native';
import { useApiMutation } from '../../api/hooks';
import { createGameLeague } from '../../api/urls/createGameLeague';
import { joinGameLeague } from '../../api/urls/joinGameLeague';
import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

export const useLeagues = () => {
    const { setMyGameLeague } = useGameLeagueContext();
    const navigation = useNavigation();

    const { mutateAsync: createGameLeagueFn } = useApiMutation(
        createGameLeague,
        () => console.log('League created'),
        (err) => console.error({ err }),
    );

    const { mutateAsync: joinGameLeagueFn } = useApiMutation(
        joinGameLeague,
        () => console.log('Joined league'),
        (err) => console.error({ err }),
    );

    const renderItem = ({ item, index }, refetchMyGameLeagues, setErrors, cleanStates) => (
        <View
            key={item.idLigaJuego}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#52C1CA',
                padding: 10,
                marginVertical: 5,
            }}
        >
            <TouchableOpacity
                onPress={async () => {
                    const { data: updatedMyGameLeaguesData } = await refetchMyGameLeagues();
                    if (
                        !updatedMyGameLeaguesData.data.some(
                            (i) => i.idLigaJuego === item.idLigaJuego,
                        )
                    ) {
                        setErrors((_errors) => ({
                            selectedLeague:
                                'La liga seleccionada no existe o ya no pertences a ella',
                        }));
                    } else {
                        setMyGameLeague(item);
                        cleanStates();
                        navigation.navigate('BottomTabs');
                    }
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nombre: {item.nombre}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Estado: {item.estado}</Text>
            </TouchableOpacity>
        </View>
    );

    const handleCreateLeague = async (
        nameLeague,
        idLeague,
        user,
        refetchGameLeagues,
        setErrors,
        cleanStates,
    ) => {
        const { data: updatedGameLeaguesData } = await refetchGameLeagues();
        let err = {};
        if (!nameLeague) err = { ...err, nameLeague: 'El nombre de la liga es obligatorio' };
        if (!idLeague) err = { ...err, idLeague: 'La liga es obligatoria' };
        if (err.nameLeague || err.idLeague) {
            setErrors((_errors) => ({ ..._errors, ...err }));
        } else if (updatedGameLeaguesData.data.some((i) => i.nombre === nameLeague)) {
            setErrors((_errors) => ({
                ..._errors,
                nameLeague: 'Ya existe una liga con este nombre',
            }));
        } else {
            const league = {
                idLiga: idLeague,
                nombre: nameLeague,
                idUsuario: user.uid,
                nombreUsuario: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
            };
            createGameLeagueFn(league)
                .then((league) => {
                    cleanStates();
                    setMyGameLeague(league.data);
                    navigation.navigate('BottomTabs');
                })
                .catch((err) => console.error({ err }));
        }
    };

    const handleJoinLeague = async (
        codeLeague,
        user,
        refetchGameLeagues,
        refetchMyGameLeagues,
        setErrors,
        cleanStates,
    ) => {
        const { data: updatedGameLeaguesData } = await refetchGameLeagues();
        const { data: updatedMyGameLeaguesData } = await refetchMyGameLeagues();
        if (!codeLeague) {
            setErrors((_errors) => ({
                codeLeague: 'El código de la liga es obligatorio',
            }));
        } else if (!updatedGameLeaguesData.data.some((i) => i.codLiga === codeLeague)) {
            setErrors((_errors) => ({
                codeLeague: 'El código no pertenece a ninguna liga',
            }));
        } else if (updatedMyGameLeaguesData.data.some((i) => i.codLiga === codeLeague)) {
            setErrors((_errors) => ({
                codeLeague: 'Ya perteneces a esta liga',
            }));
        } else if (
            updatedGameLeaguesData.data.some(
                (i) => i.codLiga === codeLeague && i.estado === 'cerrada',
            )
        ) {
            setErrors((_errors) => ({
                codeLeague: 'La liga está cerrada',
            }));
        } else {
            const league = {
                codLiga: codeLeague,
                idUsuario: user.uid,
                nombreUsuario: user.displayName,
                photoURL: user.photoURL,
            };
            joinGameLeagueFn(league)
                .then((league) => {
                    cleanStates();
                    setMyGameLeague(league.data);
                    navigation.navigate('BottomTabs');
                })
                .catch((err) => console.error({ err }));
        }
    };

    return {
        handleCreateLeague,
        handleJoinLeague,
        renderItem,
    };
};
