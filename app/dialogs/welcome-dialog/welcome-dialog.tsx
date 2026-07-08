import { useGameControls } from "~/providers/game-controls-provider";
import React, { type RefObject, useState } from "react";

import styles from "./welcome-dialog.module.css";
import { useMobileDetection } from "~/providers/mobile-detection-provider";
import { WelcomeText } from "~/dialogs/welcome-dialog/welcome-text";
import { MobileWarningText } from "~/dialogs/welcome-dialog/mobile-warning-text";

export const WelcomeDialog = ({ closeCallbackRef }: { closeCallbackRef: RefObject<() => void> }) => {
    const { startGame } = useGameControls();
    const { isMobile } = useMobileDetection();

    const [showMobileWarning, setShowMobileWarning] = useState(false);

    // Start the game when the modal closes
    closeCallbackRef.current = startGame;

    return (
        <div className={ styles.welcomeDialog + " flex justify-center flex-col" }>
            {
                !showMobileWarning && <>
                    <WelcomeText/>
                    <p className={ "flex justify-end" }>
                        {
                            !isMobile &&
                            <button autoFocus type="submit"
                                    className="close-button"
                                    commandfor="welcome-dialog" command="close">
                                Let's go!
                            </button>
                        }
                        {
                            isMobile &&
                            <button autoFocus type="submit"
                                    className="close-button"
                                    onClick={ () => setShowMobileWarning(true) }>
                                Let's go!
                            </button>
                        }
                    </p>
                </>
            }
            {
                showMobileWarning && <>
                    <MobileWarningText/>
                    <p className={ "flex justify-end" }>
                        <button autoFocus type="submit"
                                className="close-button"
                                commandfor="welcome-dialog" command="close">
                            I'll give it a try
                        </button>
                    </p>
                </>
            }
        </div>
    );
};
