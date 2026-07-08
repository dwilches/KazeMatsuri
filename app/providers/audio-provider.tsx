import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
    playBgMusic: () => void;
    pauseBgMusic: () => void;

    musicVolume: number;
    setMusicVolume: (volume: number) => void;

    playBalloonPopSound: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {

    const bgAudioRef = useRef<HTMLAudioElement>(null);
    const popAudioRef = useRef<HTMLAudioElement>(null);

    const [musicVolume, setMusicVolume] = useState(0.5); // half volume by default

    useEffect(() => {
        // Not having the DOM element is normal when starting the application
        if (bgAudioRef.current) {
            bgAudioRef.current.volume = musicVolume;
        }
    }, [musicVolume]);

    const playBgMusic = () => {
        if (!bgAudioRef.current) {
            // Not having the DOM element is normal when starting the application
            return;
        }

        bgAudioRef.current.play()
            .catch(error => console.error("Couldn't play BG music:", error));
    };

    const pauseBgMusic = () => {
        if (!bgAudioRef.current) {
            throw "Can't pause BG music, there is no audio DOM element";
        }

        bgAudioRef.current.pause();
    };

    const playBalloonPopSound = () => {
        if (!popAudioRef.current) {
            console.error("Error playing pop sound, there is no audio DOM element");
            return;
        }

        const audioClone = popAudioRef.current.cloneNode(true) as HTMLAudioElement;
        audioClone.volume = musicVolume;
        audioClone.play()
            .catch(error => console.error("Couldn't play pop sound:", error));
        audioClone.addEventListener("ended", () => audioClone.remove());
    };

    const providerValues = {
        playBgMusic, pauseBgMusic,
        musicVolume, setMusicVolume,
        playBalloonPopSound,
    };

    return (
        <AudioContext.Provider value={ providerValues }>
            { children }

            <audio ref={ bgAudioRef }
                   src="audio/bg-music.mp3"
                   loop/>
            <audio ref={ popAudioRef }
                   src="audio/balloon-pop.mp3"/>
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
