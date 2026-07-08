import React, { useState } from "react";
import { CreditsDialog } from "~/dialogs/credits-dialog/credits-dialog";
import { ModalDialog } from "~/dialogs/modal-dialog";
import { useGameControls } from "~/providers/game-controls-provider";
import { useAudio } from "~/providers/audio-provider";

export const GameFooter = () => {

    const { setGamePaused } = useGameControls();
    const { playBgMusic } = useAudio();

    const [isCreditsModalOpen, setCreditsModalOpen] = useState(false);

    const handleOpenCreditsModal = () => {
        setGamePaused(true);
        setCreditsModalOpen(true);
    };

    const handleCloseCreditsModal = () => {
        playBgMusic();
        setGamePaused(false);
        setCreditsModalOpen(false);
    };

    return (
        <div className="game-footer">
            <div className={"cursor-pointer text-amber-300 hover:underline"} onClick={ handleOpenCreditsModal }>Credits</div>

            {
                isCreditsModalOpen &&
                <ModalDialog id={ "credits-dialog" }
                             isOpen={ isCreditsModalOpen }
                             onClose={ () => handleCloseCreditsModal() }>
                    <CreditsDialog/>
                </ModalDialog>
            }
        </div>
    );
};
