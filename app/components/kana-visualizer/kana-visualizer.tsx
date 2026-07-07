import { useKanaInput } from "~/providers/kana-input-provider/kana-input-provider";
import React from "react";
import styles from "./kana-visualizer.module.css";

export const KanaVisualizer = () => {
    const { partialKanas, unconsumedLetters } = useKanaInput();

    return (
        <div className={ styles.kanaVisualizer }>
            <span style={ { color: "#ff9a44" } }>{ partialKanas }</span>
            <span style={ { color: "#ff6097" } }>{ unconsumedLetters }</span>
        </div>
    );
};
