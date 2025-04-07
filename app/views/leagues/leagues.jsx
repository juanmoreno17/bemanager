import React, { useState } from 'react';
import { View } from 'react-native';

// API
//import { useApiQuery } from '../../api/hooks';
//import { getLeagues } from '../../api/urls/leagues';

// Components
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { ModalCustom } from '../../components/modal';

//Styles
import { styles } from './leagues.styles';

export const Leagues = () => {
    //const [leagues, setLeagues] = useState([]);
    const [nameLeague, setNameLeague] = useState('');
    const [codeLeague, setCodeLeague] = useState('');
    const [view, setView] = useState(false);
    const [view2, setView2] = useState(false);
    return (
        <View style={styles.container}>
            <Button title="Crear liga" action={() => setView(true)} />
            <ModalCustom visible={view} onClose={() => setView(false)}>
                <Input title="Nombre de la liga" value={nameLeague} />
                <Button title="Save" />
            </ModalCustom>
            <Button title="Unirse a liga" action={() => setView2(true)} />
            <ModalCustom visible={view2} onClose={() => setView2(false)}>
                <Input title="Código de la liga" value={codeLeague} />
                <Button title="Save" />
            </ModalCustom>
        </View>
    );
};
