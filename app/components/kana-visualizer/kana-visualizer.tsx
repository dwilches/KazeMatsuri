import { useKanaInput } from "~/providers/kana-input-provider/kana-input-provider";
import React from "react";
import styles from "./kana-visualizer.module.css";

export const KanaVisualizer = () => {
    const { partialKanas, unconsumedLetters } = useKanaInput();

    return (
        <div className={ styles.kanaVisualizer }>
            <span className={ "text-orange-400" }>{ partialKanas }</span>
            <span className={ "text-rose-400" }>{ unconsumedLetters }</span>
        </div>
    );
};
