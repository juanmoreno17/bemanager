import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useQueries } from '@tanstack/react-query';
import { useMyContext } from '../../hooks/myContext';

// API
import { useApiQuery, useApiMutation } from '../../api/hooks';
import { getLeagues } from '../../api/urls/getLeagues';
import { getMyGameLeagues } from '../../api/urls/getMyGameLeagues';
import { getGameLeagues } from '../../api/urls/getGameLeagues';
import { createGameLeague } from '../../api/urls/createGameLeague';
import { joinGameLeague } from '../../api/urls/joinGameLeague';

// Components
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { ModalCustom } from '../../components/modal';

//Styles
import { styles } from './leagues.styles';

export const Leagues = () => {
    const [nameLeague, setNameLeague] = useState('');
    const [codeLeague, setCodeLeague] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [myGameLeagues, setMyGameLeagues] = useState([]);
    const [gameLeagues, setGameLeagues] = useState([]);
    const [idLeague, setIdLeague] = useState('');
    const [view, setView] = useState(false);
    const [view2, setView2] = useState(false);
    const { user } = useMyContext();
    const { setMyGameLeague } = useMyContext();
    const [errors, setErrors] = useState({
        nameLeague: '',
        idLeague: '',
        codeLeague: '',
    });

    const navigation = useNavigation();

    /*const queries = useQueries([
        {
            queryKey: ['getLeagues'],
            queryFn: getLeagues,
        },
        {
            queryKey: ['getMyGameLeagues'],
            queryFn: getMyGameLeagues,
        },
    ]);*/

    const { data: getLeaguesData } = useApiQuery(['getLeagues'], getLeagues);
    const { data: getGameLeaguesData } = useApiQuery(['getGameLeagues'], getGameLeagues);
    const { data: getMyGameLeaguesData } = useApiQuery(['getMyGameLeagues'], getMyGameLeagues);

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

    useEffect(() => {
        if (getLeaguesData) {
            console.log('Leagues data:', getLeaguesData.data);
            console.log('User:', user);
            setLeagues(getLeaguesData.data);
        }
    }, [getLeaguesData]);

    useEffect(() => {
        if (getMyGameLeaguesData) {
            console.log('My game leagues data:', getMyGameLeaguesData.data);
            setMyGameLeagues(getMyGameLeaguesData.data);
        }
    }, [getMyGameLeaguesData]);

    useEffect(() => {
        if (getGameLeaguesData) {
            console.log('Game leagues data:', getGameLeaguesData.data);
            setGameLeagues(getGameLeaguesData.data);
        }
    }, [getGameLeaguesData]);

    const cleanStates = () => {
        setNameLeague('');
        setCodeLeague('');
        setIdLeague('');
        setView(false);
        setView2(false);
        setErrors({
            nameLeague: '',
            idLeague: '',
            codeLeague: '',
        });
    };

    const renderItem = ({ item, index }) => (
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
                onPress={() => {
                    setMyGameLeague(item);
                    navigation.navigate('BottomTabs');
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nombre: {item.nombre}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Estado: {item.estado}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Ligas</Text>
            <FlatList
                data={myGameLeagues}
                renderItem={renderItem}
                keyExtractor={(item) => item.idLigaJuego}
            />
            <Button title="Crear liga" action={() => setView(true)} />
            <ModalCustom visible={view} onClose={() => cleanStates()}>
                <Input
                    title="Nombre de la liga"
                    custom={{
                        value: nameLeague,
                        onChangeText: (name) => {
                            setNameLeague(name);
                            setErrors((_errors) => ({ ..._errors, nameLeague: '' }));
                        },
                    }}
                />
                {errors.nameLeague ? (
                    <Text style={styles.errorLabel}>{errors.nameLeague}</Text>
                ) : null}
                <Picker
                    selectedValue={idLeague}
                    onValueChange={(itemValue, itemIndex) => {
                        setIdLeague(itemValue);
                        setErrors((_errors) => ({ ..._errors, idLeague: '' }));
                    }}
                >
                    <Picker.Item label="Seleccione una liga" value="" />
                    {leagues.map((i) => (
                        <Picker.Item key={i.idLiga} label={i.nombre} value={i.idLiga} />
                    ))}
                </Picker>
                {errors.idLeague ? <Text style={styles.errorLabel}>{errors.idLeague}</Text> : null}
                <Button
                    title="Crear liga"
                    action={() => {
                        let err = {};
                        if (!nameLeague)
                            err = { ...err, nameLeague: 'El nombre de la liga es obligatorio' };
                        if (!idLeague) err = { ...err, idLeague: 'La liga es obligatoria' };
                        if (err.nameLeague || err.idLeague) {
                            setErrors((_errors) => ({ ..._errors, ...err }));
                        } else if (gameLeagues.some((i) => i.nombre === nameLeague)) {
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
                            };
                            createGameLeagueFn(league)
                                .then((league) => {
                                    cleanStates();
                                    setMyGameLeague(league.data);
                                    console.log('League created:', league.data);
                                    navigation.navigate('BottomTabs');
                                })
                                .catch((err) => console.error({ err }));
                        }
                    }}
                />
            </ModalCustom>
            <Button title="Unirse a liga" action={() => setView2(true)} />
            <ModalCustom visible={view2} onClose={() => cleanStates()}>
                <Input
                    title="Código de la liga"
                    custom={{
                        value: codeLeague,
                        onChangeText: (code) => {
                            setCodeLeague(code);
                            setErrors((_errors) => ({ ..._errors, codeLeague: '' }));
                        },
                    }}
                />
                {errors.codeLeague ? (
                    <Text style={styles.errorLabel}>{errors.codeLeague}</Text>
                ) : null}
                <Button
                    title="Unirse a liga"
                    action={() => {
                        if (!codeLeague) {
                            setErrors((_errors) => ({
                                ..._errors,
                                codeLeague: 'El código de la liga es obligatorio',
                            }));
                        } else if (!gameLeagues.some((i) => i.codLiga === codeLeague)) {
                            setErrors((_errors) => ({
                                ..._errors,
                                codeLeague: 'El código no pertenece a ninguna liga',
                            }));
                        } /*else if (myGameLeagues.some((i) => i.codLiga === codeLeague)) {
                            setErrors((_errors) => ({
                                ..._errors,
                                codeLeague: 'Ya perteneces a esta liga',
                            }));
                        }*/ else if (
                            gameLeagues.some(
                                (i) => i.codLiga === codeLeague && i.estado === 'cerrada',
                            )
                        ) {
                            setErrors((_errors) => ({
                                ..._errors,
                                codeLeague: 'La liga está cerrada',
                            }));
                        } else {
                            const league = {
                                codLiga: codeLeague,
                                idUsuario: user.uid,
                                nombreUsuario: user.displayName,
                            };
                            joinGameLeagueFn(league)
                                .then((league) => {
                                    cleanStates();
                                    setMyGameLeague(league.data);
                                    console.log('Joined league:', league.data);
                                    navigation.navigate('BottomTabs');
                                })
                                .catch((err) => console.error({ err }));
                        }
                    }}
                />
            </ModalCustom>
        </View>
    );
};
