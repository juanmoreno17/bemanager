// jest.setup.js
import '@testing-library/jest-native/extend-expect';
import { NativeModules } from 'react-native';

// Mock react-navigation
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            goBack: jest.fn(),
            navigate: jest.fn(),
        }),
    };
});

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
    launchImageLibrary: jest.fn(),
    launchCamera: jest.fn(),
}));

// 1) Parchea NativeModules para que exista RNFirebaseAppModule
NativeModules.RNFirebaseAppModule = NativeModules.RNFirebaseAppModule || {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
};

// 2) (Opcional) silencia el propio NativeEventEmitter de RN si algún paquete lo usa “a pelo”
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('./app/utils/uploadFile', () => ({
    // ajusta ruta según dónde está jest.setup.js
    UploadFile: jest.fn(),
}));

// 3) Mock de @react-native-firebase/app
jest.mock('@react-native-firebase/app', () => {
    return {
        __esModule: true,
        default: {
            app: jest.fn(() => ({ name: '[DEFAULT]' })),
            apps: [],
            initializeApp: jest.fn(),
        },
    };
});

// 4) Mock de @react-native-firebase/auth
jest.mock('@react-native-firebase/auth', () => {
    // devuelve una “instancia” simulada de auth()
    return () => ({
        currentUser: null,
        onAuthStateChanged: jest.fn(),
        createUserWithEmailAndPassword: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
        updateProfile: jest.fn(),
    });
});
