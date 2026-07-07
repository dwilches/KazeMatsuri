import React, { useState } from "react";
import { useGameControls } from "~/providers/game-controls-provider";
import { ModalDialog } from "~/dialogs/modal-dialog";
import { SettingsDialog } from "~/dialogs/settings-dialog/settings-dialog";
import { useAudio } from "~/providers/audio-provider";
import styles from "./game-controls.module.css";

export function GameControls() {
    const { isGamePaused, toggleGamePaused } = useGameControls();
    const { playBgMusic, pauseBgMusic } = useAudio();

    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

    const playIcon = isGamePaused ? "images/playing-button.png" : "images/paused-button.png";

    const handleOpenSettings = () => {
        toggleGamePaused();
        setSettingsModalOpen(true);
    };

    const handleCloseSettings = () => {
        toggleGamePaused();
        setSettingsModalOpen(false);
    };

    const handleToggleGamePaused = () => {
        if (isGamePaused) {
            playBgMusic();
        } else {
            pauseBgMusic();
        }
        toggleGamePaused();
    };

    return (
        <div className={ styles.gameControls }>

            <img src={ playIcon }
                 width={ 48 } height={ 48 }
                 onClick={ handleToggleGamePaused }
                 alt=""
                 title="Play/Pause"/>

            <img src={ "images/settings-button.svg" }
                 width={ 48 } height={ 48 }
                 onClick={ () => handleOpenSettings() }
                 alt="Settings"
                 title="Settings"/>

            {
                isSettingsModalOpen &&
                <ModalDialog id={ "settings-dialog" }
                             isOpen={ isSettingsModalOpen }
                             onClose={ () => handleCloseSettings() }>
                    <SettingsDialog/>
                </ModalDialog>
            }
        </div>
    );
}
