import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(undefined);

function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext debe ser usado dentro de UserProvider');
    }
    return context;
}

const UserProvider = (props) => {
    const [user, setUser] = useState(null);

    return <UserContext.Provider {...props} value={{ user, setUser }} />;
};

export { UserProvider, useUserContext };
