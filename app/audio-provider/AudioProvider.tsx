import React, { createContext, useContext, useRef } from "react";

interface AudioContextType {
    playBgMusic: (play: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {

    const bgAudioRef = useRef<HTMLAudioElement | null>(null);

    const playBgMusic = (play: boolean) => {
        console.log("playing bgMusic", play);
        if (bgAudioRef.current) {
            bgAudioRef.current.play()
                .catch(error => console.error("Couldn't play BG music:", error));
        }
    };

    return (
        <AudioContext.Provider value={ { playBgMusic } }>
            { children }

            <audio ref={ bgAudioRef }
                   src="/audio/mochamusic-sugar-rush-405676.mp3"
                   loop/>
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
