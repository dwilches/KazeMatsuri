import { useGameControls } from "~/providers/game-controls-provider";
import React, { type RefObject } from "react";


export const WelcomeDialog = ({ closeCallbackRef }: { closeCallbackRef: RefObject<() => void> }) => {
    const { startGame } = useGameControls();

    // Start the game when the modal closes
    closeCallbackRef.current = startGame;

    return (
        <div className="welcome-dialog flex justify-center flex-col">
            <h1 style={ { color: "#ffdd67" } }>Hello 👋!</h1>
            <p>This is a game I created for practicing <a href="https://react.dev/" target="_blank">React</a>, and to
                help me remember the pronunciation of Kanjis.</p>
            <p>Kanjis are Japanese characters like <span className="japanese">風</span> which can be read
                as <span className="japanese">かぜ</span> (kaze) or
                as <span className="japanese">ふう</span> (fuu) depending on which other "symbols" appear around it.</p>
            <p>Remembering kanji pronunciations is hard due to these multiple readings. For this reason I have long
                wanted to create this game to help me remember them.</p>
            <p style={ { color: "#ffdd67" } }>To play this game, pop the balloons before they reach the top of the
                screen by writing the pronunciation of the kanji above each one.</p>
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
