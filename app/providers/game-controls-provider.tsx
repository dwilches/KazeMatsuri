import React, { useContext, useState } from "react";

interface GameControlsType {
    difficulty: number;
    setDifficulty: (difficulty: number) => void;

    isGamePaused: boolean;
    toggleGamePaused: () => void;
}

const GameControlsContext = React.createContext<GameControlsType | null>(null);

export const GameControlsProvider = ({ children }: { children: React.ReactNode }) => {
    const [difficulty, setDifficulty] = useState(1);
    const [isGamePaused, setGamePaused] = useState(false);

    const toggleGamePaused = () => {
        setGamePaused(!isGamePaused);
    };

    const contextValues = {
        difficulty, setDifficulty,
        isGamePaused, toggleGamePaused,
    };

    return (
        <GameControlsContext.Provider value={ contextValues }>
            { children }
        </GameControlsContext.Provider>
    );
};

export const useGameControls = () => {
    const context = useContext(GameControlsContext);
    if (!context) {
        throw new Error("Error locating GameControlsContext. The component needs to be wrapped in " +
            "<GameControlsProvider> to use 'useGameControls'");
    }
    return context;
};
