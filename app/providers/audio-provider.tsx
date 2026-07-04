import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useGameControls } from "~/providers/game-controls-provider";

interface AudioContextType {
    playBgMusic: () => void;
    bgMusicVolume: number;
    setBgMusicVolume: (volume: number) => void;
    isPlayingBgMusic: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {

    const bgAudioRef = useRef<HTMLAudioElement>(null);
    const [isPlayingBgMusic, setIsPlayingBgMusic] = useState(false);
    const [bgMusicVolume, setBgMusicVolume] = useState(0.5); // half volume by default
    const {isGamePaused} = useGameControls();

    useEffect(() => {
        if (bgAudioRef.current) {
            bgAudioRef.current.volume = bgMusicVolume;

            if (bgMusicVolume == 0 || isGamePaused) {
                pauseBgMusic();
            } else if (!isPlayingBgMusic) {
                playBgMusic();
            }
        }
    }, [bgMusicVolume, isGamePaused]);

    const playBgMusic = () => {
        if (!bgAudioRef.current) {
            // Can't play BG music, until there is a DOM element, this is not an error, it's normal when starting
            // the application
            return;
        }

        bgAudioRef.current.play()
            .then(() => setIsPlayingBgMusic(true))
            .catch(error => console.error("Couldn't play BG music:", error));
    };

    const pauseBgMusic = () => {
        if (!bgAudioRef.current) {
            throw "Can't pause BG music, there is no audio DOM element";
        }

        bgAudioRef.current.pause();
        setIsPlayingBgMusic(false);
    };

    const providerValues = {
        playBgMusic, bgMusicVolume, setBgMusicVolume, isPlayingBgMusic,
    };

    return (
        <AudioContext.Provider value={ providerValues }>
            { children }

            <audio ref={ bgAudioRef }
                   src="/audio/mochamusic-sugar-rush-405676.mp3"
                   loop/>
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("Error locating AudioContext. The component needs to be wrapped in " +
            "<AudioProvider> to use 'useAudio'");
    }
    return context;
};
