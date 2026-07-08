import React, { useContext, useState } from "react";
import { useAudio } from "~/providers/audio-provider";

interface GameControlsType {
    difficulty: number;
    setDifficulty: (difficulty: number) => void;

    isGamePaused: boolean;
    setGamePaused: (pause: boolean) => void;

    startGame: () => void;
}

const GameControlsContext = React.createContext<GameControlsType | null>(null);

export const GameControlsProvider = ({ children }: { children: React.ReactNode }) => {
    const { playBgMusic } = useAudio();

    const [difficulty, setDifficulty] = useState(1);
    const [isGamePaused, setGamePaused] = useState(true);

    const startGame = () => {
        playBgMusic();
        setGamePaused(false);
    };

    const contextValues = {
        difficulty, setDifficulty,
        isGamePaused, setGamePaused,
        startGame,
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
