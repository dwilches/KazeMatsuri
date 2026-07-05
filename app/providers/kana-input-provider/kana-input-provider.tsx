import React, { createContext, useContext, useEffect, useState } from "react";
import { translateInputToKanas } from "~/providers/kana-input-provider/kanas";

interface KanaInputType {
    partialKanas: string | null;
    completeKanas: string | null;
}

const KanaInputContext = createContext<KanaInputType | null>(null);

export const KanaInputProvider = ({ children }: { children: React.ReactNode }) => {

    const [partialKanas, setPartialKana] = useState<string | null>("");
    const [completeKanas, setCompleteKana] = useState<string | null>("");

    useEffect(() => {

        let keystrokesMemory = "";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key == "Enter") {
                const { kanas, isComplete } = translateInputToKanas(keystrokesMemory);
                if (isComplete) {
                    console.log("Next Complete Kanas", kanas);
                    setCompleteKana(kanas);
                    keystrokesMemory = "";
                    return;
                }
            } else {
                const lowerKey = event.key.toLowerCase();
                if (lowerKey.length == 1 && lowerKey >= "a" && lowerKey <= "z") {
                    keystrokesMemory += lowerKey;
                } else if (event.key == "Escape") {
                    keystrokesMemory = "";
                } else if (event.key == "Backspace") {
                    keystrokesMemory = keystrokesMemory.slice(0, -1);
                }

                const  partial = translateInputToKanas(keystrokesMemory);
                setPartialKana(partial.kanas);
                console.log("Next Partial Kanas", partial, "(memory:", keystrokesMemory, ")");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const values: KanaInputType = {
        partialKanas,
        completeKanas,
    };

    return (
        <KanaInputContext.Provider value={ values }>
            { children }
        </KanaInputContext.Provider>
    );
};

export const useUserInput = () => {
    const context = useContext(KanaInputContext);
    if (!context) {
        throw new Error("Error locating KanaInputContext. The component needs to be wrapped in " +
            "<KanaInputProvider> to use 'useUserInput'");
    }
    return context;
};
