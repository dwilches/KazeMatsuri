import React, { createContext, useContext, useEffect, useState } from "react";
import { getVocabularyForLevel, type KanjiWithReadings } from "~/providers/vocabulary-provider/vocabulary";

interface VocabularyContextType {
    setLevel: (level: number) => void;
    vocabulary: KanjiWithReadings[];
}


const VocabularyContext = createContext<VocabularyContextType | null>(null);

export const VocabularyProvider = ({ children }: { children: React.ReactNode }) => {

    const [level, setLevel] = useState(1);
    const [vocabulary, setVocabulary] = useState<KanjiWithReadings[]>([]);

    useEffect(() => {
        setVocabulary(getVocabularyForLevel(level));
    }, [level]);

    const values: VocabularyContextType = {
        setLevel,
        vocabulary,
    };

    return (
        <VocabularyContext.Provider value={ values }>
            { children }
        </VocabularyContext.Provider>
    );
};

export const useVocabulary = () => {
    const context = useContext(VocabularyContext);
    if (!context) {
        throw new Error("Error locating VocabularyContext. The component needs to be wrapped in " +
            "<VocabularyProvider> to use 'useVocabulary'");
    }
    return context;
};
