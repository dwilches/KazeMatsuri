import React from "react";
import styles from "./credits-dialog.module.css";

export const CreditsDialog = () => {

    return (
        <div className={ styles.creditsDialog + " flex justify-center flex-col" }>
            <h1>Credits</h1>

            <div className={ styles.creditsGroup }>
                <p className={ styles.creditsType }>Japanese resources</p>
                <p className={ styles.creditsLink }>
                    <a href={ "https://www.wanikani.com" }
                       target="_blank" rel="noreferrer">www.wanikani.com</a>
                </p>
            </div>

            <div className={ styles.creditsGroup }>
                <p className={ styles.creditsType }>Images</p>
                <p className={ styles.creditsLink }>
                    <a href={ "https://pixabay.com" }
                       target="_blank" rel="noreferrer">pixabay.com</a>
                </p>
                <p className={ styles.creditsLink }>
                    <a href={ "https://game-icons.net/" }
                       target="_blank" rel="noreferrer">game-icons.net</a>
                </p>
            </div>

            <div className={ styles.creditsGroup }>
                <p className={ styles.creditsType }>Audio</p>
                <p className={ styles.creditsLink }>
                    <a href={ "https://pixabay.com/music/pop-sugar-rush-405676" }
                       target="_blank" rel="noreferrer">Sugar Rush @ pixabay</a>
                </p>
            </div>

            <div className={ styles.creditsGroup }>
                <p className={ styles.creditsType }>Font assets</p>
                <p className={ styles.creditsLink }>
                    <a href={ "https://www.fontspace.com/rebellion-squad-font-f114279" }
                       target="_blank" rel="noreferrer">Rebellion Squad @ FontSpace</a>
                </p>
            </div>

            <div className={ styles.creditsGroup }>
                <p className={ styles.creditsType }>Development</p>
                <p className={ styles.creditsLink }>
                    <a href={ "https://github.com/dwilches" }
                       target="_blank" rel="noreferrer">DWilches @ GitHub</a>
                </p>
            </div>

            <p className={ "flex justify-center mt-5" }>
                <button autoFocus type="submit"
                        className="close-button"
                        commandfor="credits-dialog" command="close">
                    Close
                </button>
            </p>
        </div>
    );
};
