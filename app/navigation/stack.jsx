import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

//Screen
import Routes from './stackRoutes';
import BottomTabs from './bottomTabs';

//Assets
import logout from '../assets/icons/logout.png';

const Stack = createStackNavigator();

const getButton = ({ navigation }) => (
    <TouchableOpacity
        style={{ flexDirection: 'row', marginRight: 10 }}
        onPress={() => {
            auth()
                .signOut()
                .then(() => {
                    navigation.navigate('Login');
                });
        }}
    >
        <Image
            source={logout}
            style={{
                width: 15,
                height: 15,
                tintColor: '#FFFFFF',
                marginRight: 5,
                marginTop: 3,
            }}
        />
        <Text style={{ color: '#FFFFFF' }}>Log Out</Text>
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
                        headerRight: () => getButton(nav),
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
                        headerRight: () => getButton(nav),
                        headerLeft: () => null,
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
