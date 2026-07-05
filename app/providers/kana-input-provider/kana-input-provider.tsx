import React, { createContext, useContext, useEffect, useState } from "react";
import { translateInputToKanas } from "~/providers/kana-input-provider/kanas";

interface KanaInputType {
    partialKanas: string;
    unconsumedLetters: string;
    completeKanas: string;
}

const KanaInputContext = createContext<KanaInputType | null>(null);

export const KanaInputProvider = ({ children }: { children: React.ReactNode }) => {

    const [partialKanas, setPartialKanas] = useState<string>("");
    const [completeKanas, setCompleteKanas] = useState<string>("");
    const [unconsumedLetters, setUnconsumedLetters] = useState<string>("");

    useEffect(() => {

        let keystrokesMemory = "";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key == "Enter") {
                // Do a final translation, and if all the input can be converted to kanas without leaving unconsumed
                // letters, then report it as a complete group of kanas
                const { kanas, unconsumed } = translateInputToKanas(keystrokesMemory);
                if (kanas && !unconsumed) {
                    setCompleteKanas(kanas);
                    setPartialKanas("");
                    setUnconsumedLetters("");
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
                } else {
                    // Nothing changed since last time, no need to re-report the current kanas translation status
                    return;
                }

                const partial = translateInputToKanas(keystrokesMemory);
                setPartialKanas(partial.kanas);
                setUnconsumedLetters(partial.unconsumed);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const values: KanaInputType = {
        partialKanas,
        unconsumedLetters,
        completeKanas,
    };

    return (
        <KanaInputContext.Provider value={ values }>
            { children }
        </KanaInputContext.Provider>
    );
};

export const useKanaInput = () => {
    const context = useContext(KanaInputContext);
    if (!context) {
        throw new Error("Error locating KanaInputContext. The component needs to be wrapped in " +
            "<KanaInputProvider> to use 'useUserInput'");
    }
    return context;
};
