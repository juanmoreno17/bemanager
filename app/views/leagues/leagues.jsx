import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useQueries } from '@tanstack/react-query';

// API
import { useApiQuery, useApiMutation } from '../../api/hooks';
import { getLeagues } from '../../api/urls/getLeagues';
import { getMyGameLeagues } from '../../api/urls/getMyGameLeagues';
import { createGameLeague } from '../../api/urls/createGameLeague';

// Components
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { ModalCustom } from '../../components/modal';

//Styles
import { styles } from './leagues.styles';
import back from '../../assets/icons/back.png';

export const Leagues = () => {
    const [nameLeague, setNameLeague] = useState('');
    const [codeLeague, setCodeLeague] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [myLeagues, setMyLeagues] = useState([]);
    const [idLeague, setIdLeague] = useState('');
    const [view, setView] = useState(false);
    const [view2, setView2] = useState(false);
    const [user, setUser] = useState();

    const navigation = useNavigation();

    /*const queryMultiple = () => {
        const query1 = useApiQuery(['getLeagues'], getLeagues);
        const query2 = useApiQuery(['getMyGameLeagues'], getMyGameLeagues);
        return { query1, query2 };
    };*/

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

    const { data } = useApiQuery(['getLeagues'], getLeagues);
    //const { data: getMyGameLeaguesData } = useApiQuery(['getMyGameLeagues'], getMyGameLeagues);

    const { mutateAsync } = useApiMutation(
        createGameLeague,
        () => console.log('League created'),
        (err) => console.error({ err }),
    );

    useEffect(() => {
        if (data) {
            setLeagues(data.data);
        }
    }, []);

    /*useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user && queries[1](user.uid)) {
                setUser(user);
                setMyLeagues(getMyGameLeaguesData.data);
            } else {
                navigation.navigate('Login');
            }
        });
        return () => unsubscribe();
    }, []);*/

    const renderItem = ({ item, index }) => (
        <View
            key={item.idLigaJuego}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                padding: 10,
                marginVertical: 5,
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('BottomTabs', {
                        idLigaJuego: item.idLigaJuego,
                        idLiga: item.idLiga,
                    });
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.nombre}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    width: 75,
                    marginTop: 40,
                }}
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={back}
                    style={{
                        width: 15,
                        height: 15,
                        tintColor: '#52C1CA',
                        marginLeft: 5,
                        marginRight: 5,
                        marginTop: 4,
                    }}
                />
                <Text style={{ color: '#52C1CA', fontWeight: 'bold', fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Mis Ligas</Text>
            <FlatList
                data={myLeagues}
                renderItem={renderItem}
                keyExtractor={(item) => item.idLigaJuego}
            />
            <Button title="Crear liga" action={() => setView(true)} />
            <ModalCustom visible={view} onClose={() => setView(false)}>
                <Input
                    title="Nombre de la liga"
                    custom={{
                        value: nameLeague,
                        onChangeText: (name) => setNameLeague(name),
                    }}
                />
                <Picker
                    selectedValue={idLeague}
                    onValueChange={(itemValue, itemIndex) => setIdLeague(itemValue)}
                >
                    <Picker.Item label="Seleccione una liga" value="" />
                    {leagues.map((i) => (
                        <Picker.Item key={i.idLiga} label={i.nombre} value={i.idLiga} />
                    ))}
                </Picker>
                <Button
                    title="Crear liga"
                    action={() => {
                        const league = {
                            idLiga: idLeague,
                            nombre: nameLeague,
                            idUsuario: user.uid,
                            nombreUsuario: user.displayName,
                        };
                        mutateAsync(league)
                            .then(() => {
                                setView(false);
                                setNameLeague('');
                                setIdLeague('');
                                navigation.navigate('BottomTabs', {
                                    idLigaJuego: league.idLigaJuego,
                                    idLiga: league.idLiga,
                                });
                            })
                            .catch((err) => console.error({ err }));
                    }}
                />
            </ModalCustom>
            <Button title="Unirse a liga" action={() => setView2(true)} />
            <ModalCustom visible={view2} onClose={() => setView2(false)}>
                <Input title="Código de la liga" value={codeLeague} />
                <Button title="Unirse a liga" action={() => {}} />
            </ModalCustom>
        </View>
    );
};
