import { useKanaInput } from "~/providers/kana-input-provider/kana-input-provider";
import React from "react";

export const KanaVisualizer = () => {
    const { partialKanas, unconsumedLetters } = useKanaInput();

    return (
        <div className="kana-visualizer">
            <span style={ { color: "#ff9a44" } }>{ partialKanas }</span>
            <span style={ { color: "#ff6097" } }>{ unconsumedLetters }</span>
        </div>
    );
};
