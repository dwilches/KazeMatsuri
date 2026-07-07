import { useAudio } from "~/providers/audio-provider";
import React from "react";
import { useGameControls } from "~/providers/game-controls-provider";
import { ConfigSlider } from "~/components/config-slider/config-slider";

export default function GameControls() {
    const { bgMusicVolume, setBgMusicVolume } = useAudio();
    const { isGamePaused, toggleGamePaused, difficulty, setDifficulty } = useGameControls();

    const playIcon = isGamePaused ? "images/playing-button.png" : "images/paused-button.png";

    const speakerIcon = () => {
        if (bgMusicVolume == 0) {
            return "images/speaker-0.svg";
        }
        if (bgMusicVolume <= 0.3) {
            return "images/speaker-1.svg";
        }
        if (bgMusicVolume <= 0.7) {
            return "images/speaker-2.svg";
        }
        return "images/speaker-3.svg";
    };

    const balloonsIcon = () => {
        if (difficulty < 3) {
            return "images/difficulty-1.svg";
        }
        if (difficulty <= 6) {
            return "images/difficulty-2.svg";
        }
        return "images/difficulty-3.svg";
    };

    return (
        <div className={ "game-controls" }>
            <ConfigSlider iconSrc={ speakerIcon() }
                          initialValue={ bgMusicVolume * 100 }
                          minValue={ 0 }
                          maxValue={ 100 }
                          onChange={ value => setBgMusicVolume(value / 100) }/>

            <img src={ playIcon }
                 width={ 48 } height={ 48 }
                 className={ "play-pause-button" }
                 onClick={ toggleGamePaused }
                 alt=""/>

            <ConfigSlider iconSrc={ balloonsIcon() }
                          initialValue={ difficulty }
                          minValue={ 1 }
                          maxValue={ 10 }
                          onChange={ value => setDifficulty(value) }/>
        </div>
    );
}
