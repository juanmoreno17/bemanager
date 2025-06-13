import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { styles } from './stack.styles';

//Screen
import Routes from './stackRoutes';
import BottomTabs from './bottomTabs';

//Assets
import logout from '../assets/icons/logout.png';

const Stack = createStackNavigator();

const changeLeague = ({ navigation }) => (
    <TouchableOpacity
        style={styles.button}
        onPress={() => {
            navigation.navigate('Leagues');
        }}
    >
        <MaterialDesignIcons name="swap-horizontal" size={21} color="#FFFFFF" />
        <Text style={styles.text}>Cambiar Liga</Text>
    </TouchableOpacity>
);

const logOut = ({ navigation }) => (
    <TouchableOpacity
        style={styles.button}
        onPress={() => {
            auth()
                .signOut()
                .then(() => {
                    navigation.navigate('Login');
                });
        }}
    >
        <Image source={logout} style={styles.img} />
        <Text style={styles.text}>Cerrar sesión</Text>
    </TouchableOpacity>
);

export const AppStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Routes.Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CreateUser"
                    component={Routes.CreateUser}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Leagues"
                    component={Routes.Leagues}
                    options={(nav) => ({
                        title: null,
                        headerStyle: {
                            backgroundColor: '#52C1CA',
                        },
                        headerTintColor: '#FFFFFF',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTitleAlign: 'center',
                        headerRight: () => logOut(nav),
                        headerLeft: () => null,
                    })}
                />
                <Stack.Screen
                    name="BottomTabs"
                    component={BottomTabs}
                    options={(nav) => ({
                        title: null,
                        headerStyle: {
                            backgroundColor: '#52C1CA',
                        },
                        headerTintColor: '#FFFFFF',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTitleAlign: 'center',
                        headerRight: () => logOut(nav),
                        headerLeft: () => changeLeague(nav),
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
