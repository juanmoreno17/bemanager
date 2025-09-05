import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUserContext } from '../../hooks/userContext';
import { useLeagues } from './leagues.hooks';

// API
import { useApiQuery } from '../../api/hooks';
import { getLeagues } from '../../api/urls/getLeagues';
import { getMyGameLeagues } from '../../api/urls/getMyGameLeagues';
import { getGameLeagues } from '../../api/urls/getGameLeagues';

// Components
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { ModalCustom } from '../../components/modal';

//Styles
import { styles } from './leagues.styles';

export const Leagues = () => {
    const [nameLeague, setNameLeague] = useState('');
    const [codeLeague, setCodeLeague] = useState('');
    const [idLeague, setIdLeague] = useState('');
    const [view, setView] = useState(false);
    const [view2, setView2] = useState(false);
    const { user } = useUserContext();
    const [errors, setErrors] = useState({
        nameLeague: '',
        idLeague: '',
        codeLeague: '',
        selectedLeague: '',
    });
    const { handleCreateLeague, handleJoinLeague, renderItem } = useLeagues();

    const {
        data: leaguesData,
        isLoading: leaguesLoading,
        refetch: refetchLeagues,
    } = useApiQuery(['getLeagues'], getLeagues);

    const { isLoading: gameLeaguesLoading, refetch: refetchGameLeagues } = useApiQuery(
        ['getGameLeagues'],
        getGameLeagues,
    );

    const {
        data: myGameLeaguesData,
        isLoading: myGameLeaguesLoading,
        refetch: refetchMyGameLeagues,
    } = useApiQuery(['getMyGameLeagues', user.uid], () => getMyGameLeagues(user.uid));

    useFocusEffect(
        React.useCallback(() => {
            refetchLeagues();
            refetchGameLeagues();
            refetchMyGameLeagues();
        }, []),
    );

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
            selectedLeague: '',
        });
    };

    if (leaguesLoading || gameLeaguesLoading || myGameLeaguesLoading) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Ligas</Text>
            {errors.selectedLeague ? (
                <Text style={styles.errorLabel}>{errors.selectedLeague}</Text>
            ) : null}
            <FlatList
                data={myGameLeaguesData.data}
                renderItem={(item) =>
                    renderItem(item, refetchMyGameLeagues, setErrors, cleanStates)
                }
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
                    onValueChange={(itemValue) => {
                        setIdLeague(itemValue);
                        setErrors((_errors) => ({ ..._errors, idLeague: '' }));
                    }}
                >
                    <Picker.Item label="Seleccione una liga" value="" />
                    {leaguesData.data.map((i) => (
                        <Picker.Item key={i.idLiga} label={i.nombre} value={i.idLiga} />
                    ))}
                </Picker>
                {errors.idLeague ? <Text style={styles.errorLabel}>{errors.idLeague}</Text> : null}
                <Button
                    title="Crear liga"
                    action={() => {
                        handleCreateLeague(
                            nameLeague,
                            idLeague,
                            user,
                            refetchGameLeagues,
                            setErrors,
                            cleanStates,
                        );
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
                        handleJoinLeague(
                            codeLeague,
                            user,
                            refetchGameLeagues,
                            refetchMyGameLeagues,
                            setErrors,
                            cleanStates,
                        );
                    }}
                />
            </ModalCustom>
        </View>
    );
};
