import { useGameControls } from "~/providers/game-controls-provider";
import React, { type RefObject } from "react";


export const WelcomeDialog = ({ closeCallbackRef }: { closeCallbackRef: RefObject<() => void> }) => {
    const { startGame } = useGameControls();

    // Start the game when the modal closes
    closeCallbackRef.current = startGame;

    return (
        <div className="welcome-dialog flex justify-center flex-col">
            <h1 style={ { color: "#fff0be" } }>Hello 👋!</h1>
            <p>This is a game I created to practice <a href="https://react.dev/" target="_blank">React</a> and to
                help me remember kanji pronunciations.</p>
            <p style={ { color: "#fff0be" } }>Kanji are Japanese characters like <span className="japanese">風</span>,
                which can be read as <span className="japanese">かぜ</span> (kaze)
                or <span className="japanese">ふう</span> (fū), depending on the word they're used in.</p>
            <p>Remembering kanji pronunciations is difficult because many kanji have multiple readings.
                I've wanted to create this game for a long time to help me remember them.</p>
            <p style={ { color: "#fff0be" } }>To play, pop the balloons before they reach the top of the
                screen by typing the pronunciation of the kanji above each one.</p>
            <p>If you don't remember the reading of a kanji, click or tap it to reveal the answer.</p>
            <p className={ "flex justify-end" }>
                <button autoFocus type="submit"
                        className="start-button"
                        commandfor="modal-dialog" command="close">
                    Let's go!
                </button>
            </p>
        </div>
    );
};
