import { useKanaInput } from "~/providers/kana-input-provider/kana-input-provider";
import React from "react";

export const KanaVisualizer = () => {
    const { partialKanas, unconsumedLetters } = useKanaInput();

    return (
        <div>
            <span style={ { color: "#58ecb3" } }>{ partialKanas }</span>
            <span style={ { color: "#ff6097" } }>{ unconsumedLetters }</span>
        </div>
    );
};
