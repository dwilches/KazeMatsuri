import { WanikaniLevel1 } from "~/providers/vocabulary-provider/wanikani-level-1";
import { WanikaniLevel2 } from "~/providers/vocabulary-provider/wanikani-level-2";
import { WanikaniLevel10 } from "~/providers/vocabulary-provider/wanikani-level-10";
import { WanikaniLevel7 } from "~/providers/vocabulary-provider/wanikani-level-7";
import { WanikaniLevel8 } from "~/providers/vocabulary-provider/wanikani-level-8";
import { WanikaniLevel9 } from "~/providers/vocabulary-provider/wanikani-level-9";
import { WanikaniLevel6 } from "~/providers/vocabulary-provider/wanikani-level-6";
import { WanikaniLevel5 } from "~/providers/vocabulary-provider/wanikani-level-5";
import { WanikaniLevel4 } from "~/providers/vocabulary-provider/wanikani-level-4";
import { WanikaniLevel3 } from "~/providers/vocabulary-provider/wanikani-level-3";

export interface KanjiWithReadings {
    kanji: string;
    readings: string[];
    url: string;
    type: "vocabulary" | "kanji";
}

// Default vocabulary for every level, the name of the game :)
const DefaultVocabulary: KanjiWithReadings[] = [
    {
        kanji: "風",
        readings: ["かぜ", "ふう"],
        url: "https://www.wanikani.com/vocabulary/%E9%A2%A8",
        type: "vocabulary",
    },
    {
        kanji: "祭り",
        readings: ["まつり"],
        url: "https://www.wanikani.com/vocabulary/%E7%A5%AD%E3%82%8A",
        type: "vocabulary",
    },
];

/*
 * The content of each of the level files was produced with the script:
 *
 * for WANIKANI_LEVEL in {1..10}; do
 *   echo "export const WanikaniLevel$WANIKANI_LEVEL = " > app/providers/vocabulary-provider/wanikani-level-$WANIKANI_LEVEL.tsx
 *   curl "https://api.wanikani.com/v2/subjects?levels=$WANIKANI_LEVEL&types=kanji,vocabulary" \
 *      -H "Authorization: Bearer $WANIKANI_TOKEN" | \
 *      jq --indent 4 '.data | map(({type: .object, kanji: .data.slug, url: .data.document_url, readings: .data.readings | map(.reading)}))' \
 *      >> app/providers/vocabulary-provider/wanikani-level-$WANIKANI_LEVEL.tsx
 * done
*/
const WanikaniLevels: Record<number, KanjiWithReadings[]> = {
    1: WanikaniLevel1,
    2: WanikaniLevel2,
    3: WanikaniLevel3,
    4: WanikaniLevel4,
    5: WanikaniLevel5,
    6: WanikaniLevel6,
    7: WanikaniLevel7,
    8: WanikaniLevel8,
    9: WanikaniLevel9,
    10: WanikaniLevel10,
};

export const getVocabularyForLevel = (level: number): KanjiWithReadings[] => {
    const wanikaniLevelVocabulary = WanikaniLevels[level];
    return [
        ...DefaultVocabulary,
        ...wanikaniLevelVocabulary,
    ];
};
