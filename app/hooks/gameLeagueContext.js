import React, { createContext, useContext, useState } from 'react';

const GameLeagueContext = createContext(undefined);

function useGameLeagueContext() {
    const context = useContext(GameLeagueContext);
    if (!context) {
        throw new Error('useGameLeagueContext debe ser usado dentro de GameLeagueProvider');
    }
    return context;
}

const GameLeagueProvider = (props) => {
    const [myGameLeague, setMyGameLeague] = useState(null);

    return <GameLeagueContext.Provider {...props} value={{ myGameLeague, setMyGameLeague }} />;
};

export { GameLeagueProvider, useGameLeagueContext };
