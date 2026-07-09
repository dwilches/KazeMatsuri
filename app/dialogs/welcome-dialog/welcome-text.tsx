import React from "react";

import styles from "./welcome-dialog.module.css";

export const WelcomeText = () => {
    return (<>
        <h1 className={ styles.altTextColor }>Hello <span className={ styles.noStrokeStyle }>👋</span>!</h1>
        <p>This is a game I created to practice <a href="https://react.dev/" target="_blank">React</a> and to
            help me remember kanji pronunciations.</p>
        <p className={ styles.altTextColor }>Kanji are Japanese characters
            like <span className={ styles.japaneseWord }>風</span>,
            which can be read as <span className={ styles.japaneseWord }>かぜ</span> (kaze)
            or <span className={ styles.japaneseWord }>ふう</span> (fū), depending on the word they're used in.</p>
        <p>Remembering kanji pronunciations is difficult because many kanji have multiple readings.
            I've wanted to create this game for a long time to help me remember them.</p>
        <p className={ styles.altTextColor }>To play, pop the balloons before they reach the top of the
            screen by typing the pronunciation of the kanji above each one.</p>
        <p>If you don't remember the reading of a kanji, click or tap it to reveal the answer.</p>
    </>);
};
