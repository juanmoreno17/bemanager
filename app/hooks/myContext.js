import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext(undefined);

function useMyContext() {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error('useMyContext must be used within MyProvider');
    }
    return context;
}

const MyProvider = (props) => {
    const [user, setUser] = useState(null);
    const [myGameLeague, setMyGameLeague] = useState(null);

    return (
        <MyContext.Provider {...props} value={{ user, setUser, myGameLeague, setMyGameLeague }} />
    );
};

export { MyProvider, useMyContext };
