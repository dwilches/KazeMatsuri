type KanaGroup = Record<string, string>;

const AllKanas: Record<string, string | KanaGroup> = {
    a: "あ",
    i: "い",
    u: "う",
    e: "え",
    o: "お",
    k: { ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ", kya: "きゃ", kyu: "きゅ", kyo: "きょ" },
    g: { ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご", gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ" },
    s: { sa: "さ", si: "し", shi: "し", su: "す", se: "せ", so: "そ", sha: "しゃ", shu: "しゅ", sho: "しょ" },
    z: { za: "ざ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ" },
    j: { ja: "じゃ", ju: "じゅ", jo: "じょ" },
    t: { ta: "た", ti: "ち", tu: "つ", tsu: "つ", te: "て", to: "と", t: "っ" },
    c: { chi: "ち", cha: "ちゃ", chu: "ちゅ", cho: "ちょ" },
    d: { da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど" },
    n: { na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の", nya: "にゃ", nyu: "にゅ", nyo: "にょ", nn: "ん", n: "ん" },
    h: { ha: "は", hi: "ひ", hu: "ふ", he: "へ", ho: "ほ", nya: "ひゃ", nyu: "ひゅ", nyo: "ひょ" },
    f: { fu: "ふ" },
    b: { ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ", bya: "びゃ", byu: "びゅ", byo: "びょ" },
    p: { pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ", pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ" },
    m: { ma: "ま", mi: "み", mu: "む", me: "め", mo: "も", mya: "みゃ", myu: "みゅ", myo: "みょ" },
    y: { ya: "や", yu: "ゆ", yo: "よ" }, // ゃ ゅ ょ
    r: { ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ", rya: "りゃ", ryu: "りゅ", ryo: "りょ" },
    w: { wa: "わ", wo: "を" },
};

export interface KanaTranslation {
    kanas: string;
    unconsumed: string;
}

export const translateInputToKanas = (input: string): KanaTranslation => {
    if (input.length === 0) {
        return { kanas: "", unconsumed: "" };
    }

    const kanaGroup = AllKanas[input[0]];
    // If there are no kanas we can form from this string, then
    if (!kanaGroup) {
        return { kanas: "", unconsumed: input };
    }

    // If the group only has one element, collect the kana and process the rest of the string
    if (typeof kanaGroup === "string") {
        const carKanas = kanaGroup;
        const cdrKanas = translateInputToKanas(input.slice(1));

        return {
            kanas: carKanas + cdrKanas.kanas,
            unconsumed: cdrKanas.unconsumed,
        };
    }

    // If the group has multiple options, check if any option can be completed
    const { kanas, unconsumed } = getLeadingKanas(input, kanaGroup);
    if (!kanas) {
        return { kanas: "", unconsumed: input };
    }

    const carKanas = kanas;
    const cdrKanas = translateInputToKanas(unconsumed);
    return {
        kanas: carKanas + cdrKanas.kanas,
        unconsumed: cdrKanas.unconsumed,
    };
};

const getLeadingKanas = (input: string, kanaGroup: KanaGroup): KanaTranslation => {
    for (const kana of Object.keys(kanaGroup)) {
        if (input.startsWith(kana)) {
            return {
                kanas: kanaGroup[kana],
                unconsumed: input.slice(kana.length),
            };
        }
    }
    return {
        kanas: "",
        unconsumed: input,
    };
};
