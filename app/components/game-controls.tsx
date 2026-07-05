import { useAudio } from "~/providers/audio-provider";
import React from "react";
import { useGameControls } from "~/providers/game-controls-provider";

export default function GameControls() {
    const { bgMusicVolume, setBgMusicVolume } = useAudio();
    const { isGamePaused, toggleGamePaused, difficulty, setDifficulty } = useGameControls();

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value) / 100;
        setBgMusicVolume(newVolume);
    };

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDifficulty = parseInt(event.target.value);
        setDifficulty(newDifficulty);
    };

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

    // Adds an animation to the sliders thumb, making the thumb larger as the volume/difficulty increases
    const valueToSliderHeight = (value: number): string => {
        // value -> [0, 1]
        // height -> [0.8, 1.2]
        const height = value * (1.2 - 0.8) + 0.8;
        return `${ height }rem`;
    };

    return (
        <div className={ "game-controls" }>
            <div className={ "slider-container" }>
                <img id="volume-icon"
                     src={ speakerIcon() }
                     alt=""/>
                <input type="range"
                       min={ 0 } max={ 100 } value={ bgMusicVolume * 100 }
                       style={ {
                           "--slider-thumb-height": valueToSliderHeight(bgMusicVolume),
                       } as React.CSSProperties }
                       onChange={ handleVolumeChange }/>
            </div>

            <img src={ playIcon }
                 width={ 48 } height={ 48 }
                 className={ "play-pause-button" }
                 onClick={ toggleGamePaused }
                 alt=""/>

            <div className={ "slider-container" }>
                <img id="difficulty-icon"
                     src={ balloonsIcon() }
                     width={ 48 } height={ 48 }
                     alt=""/>
                <input type="range"
                       min={ 1 } max={ 10 } value={ difficulty }
                       style={ {
                           "--slider-thumb-height": valueToSliderHeight(difficulty / 10),
                       } as React.CSSProperties }
                       onChange={ handleDifficultyChange }/>
            </div>
        </div>
    );
}
