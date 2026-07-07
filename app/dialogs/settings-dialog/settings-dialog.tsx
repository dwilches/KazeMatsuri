import { ConfigSlider } from "~/components/config-slider/config-slider";
import React from "react";
import { useAudio } from "~/providers/audio-provider";
import { useGameControls } from "~/providers/game-controls-provider";
import styles from "./settings-dialog.module.css";
import { useVocabulary } from "~/providers/vocabulary-provider/vocabulary-provider";

export const SettingsDialog = () => {
    const { bgMusicVolume, setBgMusicVolume } = useAudio();
    const { difficulty, setDifficulty } = useGameControls();
    const { level, setLevel } = useVocabulary();

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

    const japaneseLevelIcon = () => {
        return "images/level";
    };

    return (
        <div className={ styles.settingsDialog + " flex justify-center flex-col" }>
            <h1>Settings</h1>

            <p>Volume</p>
            <ConfigSlider iconSrc={ speakerIcon() }
                          value={ bgMusicVolume * 100 }
                          minValue={ 0 }
                          maxValue={ 100 }
                          onChange={ value => setBgMusicVolume(value / 100) }/>

            <p>Difficulty</p>
            <ConfigSlider iconSrc={ balloonsIcon() }
                          value={ difficulty }
                          minValue={ 1 }
                          maxValue={ 10 }
                          onChange={ value => setDifficulty(value) }/>

            <p className={ "flex items-center gap-1" }>
                Japanese Level
                <a href={ "https://www.wanikani.com/level/" + level } target="_blank" rel="noreferrer">
                    <img src="images/info-icon.svg" width="24px" height="24px" title="Level details in Wanikani"/>
                </a>
            </p>
            <ConfigSlider iconSrc={ japaneseLevelIcon() }
                          value={ level }
                          minValue={ 1 }
                          maxValue={ 10 }
                          onChange={ value => setLevel(value) }/>

            <p className={ "flex justify-center" }>
                <button autoFocus type="submit"
                        className="close-button"
                        commandfor="settings-dialog" command="close">
                    Close
                </button>
            </p>
        </div>
    );
};
