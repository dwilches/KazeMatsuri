import { ConfigSlider } from "~/components/config-slider/config-slider";
import React from "react";
import { useAudio } from "~/providers/audio-provider";
import { useGameControls } from "~/providers/game-controls-provider";
import styles from "./settings-dialog.module.css";
import { useVocabulary } from "~/providers/vocabulary-provider/vocabulary-provider";

export const SettingsDialog = () => {
    const { musicVolume, setMusicVolume } = useAudio();
    const { difficulty, setDifficulty } = useGameControls();
    const { level, setLevel } = useVocabulary();

    const speakerIcon = () => {
        if (musicVolume == 0) {
            return "images/speaker-0.svg";
        }
        if (musicVolume <= 0.3) {
            return "images/speaker-1.svg";
        }
        if (musicVolume <= 0.7) {
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
        return "images/japanese-level.svg";
    };

    return (
        <div className={ styles.settingsDialog + " flex justify-center flex-col" }>
            <h1>Settings</h1>


            <p className={ styles.configType }>Volume</p>
            <div className={ styles.configSlider }>
                <img src={ speakerIcon() } width={ 48 } height={ 48 } alt=""/>
                <ConfigSlider value={ musicVolume * 100 }
                              minValue={ 0 }
                              maxValue={ 100 }
                              onChange={ value => setMusicVolume(value / 100) }/>
            </div>

            <p className={ styles.configType }>Difficulty</p>
            <div className={ styles.configSlider }>
                <img src={ balloonsIcon() } width={ 48 } height={ 48 } alt=""/>
                <ConfigSlider value={ difficulty }
                              minValue={ 1 }
                              maxValue={ 10 }
                              onChange={ value => setDifficulty(value) }/>
            </div>

            <p className={ styles.configType + " flex items-center gap-1" }>
                Japanese Level
                <a href={ "https://www.wanikani.com/level/" + level } target="_blank" rel="noreferrer">
                    <img src="images/info-icon.svg" width="20px" height="20px" title="Level details in WaniKani"/>
                </a>
            </p>
            <div className={ styles.configSlider }>
                <span className={ styles.japaneseLevelIconContainer }>
                    <span>{ level }</span>
                    <img src={ japaneseLevelIcon() } width={ 48 } height={ 48 } alt=""/>
                </span>
                <ConfigSlider value={ level }
                              minValue={ 1 }
                              maxValue={ 10 }
                              onChange={ value => setLevel(value) }/>
            </div>

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
