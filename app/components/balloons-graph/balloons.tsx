import { BalloonHeight, BalloonWidth, SvgHeight, SvgWidth } from "~/components/balloons-graph/constants";
import type { KanjiWithReadings } from "~/providers/vocabulary-provider/vocabulary";
import { type Confetti, createConfettiFromBalloon } from "~/components/balloons-graph/confetti";

// The balloons will sway to the sides as if wind was hitting them, and every so often they'll sway to the opposite
// side. This probability tells how often that direction change happens.
export const CrossWindChangeProbability = 0.01;

const BalloonImageUrls = [
    "images/blue-balloon.svg",
    "images/green-balloon.svg",
    "images/pink-balloon.svg",
    "images/purple-balloon.svg",
    "images/red-balloon.svg",
    "images/turquesa-balloon.svg",
    "images/yellow-balloon.svg",
];

export interface Balloon {
    imgSrc: string;
    kanji: string; // text visible in screen
    readings: string[]; // text that the user needs to write
    x: number; // position calculated on each frame
    y: number; // position calculated on each frame
    z: number; // sense of depth given by shadow distance
    ySpeed: number;
    xSpeed: number; // Cross-wind speed
}

/**
 * Balloons move up over time, and sway to the sides.
 */
export const animateBalloons = (balloons: Balloon[]) =>
    balloons
        // Update balloon's position
        .map(animateSingleBalloon)
        // Remove balloons that have floated away
        .filter(b => b.y + BalloonHeight > 0);

/**
 * Returns a copy of the balloon with an updated position, which is a bit higher up and possibly swaying to the sides.
 */
const animateSingleBalloon = (b: Balloon): Balloon => {
    const windChanged = Math.random() < CrossWindChangeProbability;
    return {
        ...b,
        x: clampBalloonX(b.x + b.xSpeed),
        y: b.y - b.ySpeed,
        xSpeed: b.xSpeed * (windChanged ? -1 : 1),
    };
};

export const insertNewBalloon = (balloons: Balloon[], vocabulary: KanjiWithReadings[]): Balloon[] => {
    return [...balloons, createNewBalloon(vocabulary)]
        // Sort according to the distance from the wall (i.e. shadow depth)
        .sort((a, b) => a.z - b.z);
};

/**
 * Picks a word from the vocabulary at random, then creates a balloon with that word.
 * The balloon's color, distance from the wall and sideways speed are also random.
 */

const createNewBalloon = (vocabulary: KanjiWithReadings[]): Balloon => {
    const randomImgIdx = Math.floor(Math.random() * BalloonImageUrls.length);
    const randomVocabulary = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    return {
        imgSrc: BalloonImageUrls[randomImgIdx],
        kanji: randomVocabulary.kanji,
        readings: randomVocabulary.readings,
        x: Math.random() * (SvgWidth - BalloonWidth),
        y: SvgHeight,
        z: Math.floor(Math.random() * 3 + 1), // Corresponds to the index of one of the shadow filters
        xSpeed: 2 * (Math.random() - 0.5), // Side-wind speed between -1 and 1
        ySpeed: 1,
    };
};

export const popBalloonsForWord = (balloons: Balloon[], word: string): {
    remainingBalloons: Balloon[],
    newConfetti: Confetti[]
} => {
    const { yes: poppedBalloons, no: remainingBalloons } = partitionBy(balloons, b => b.readings.includes(word));

    const newConfetti = poppedBalloons.map(createConfettiFromBalloon);
    return {
        remainingBalloons,
        newConfetti,
    };
};


/**
 * When used on the balloon's x position, ensures the balloon doesn't go outside the SVG bounds
 */
const clampBalloonX = (value: number): number => {
    return Math.max(0, Math.min(value, SvgWidth - BalloonWidth));
};

/**
 * Utility function to split a list according to a predicate. Because Object.groupBy is not available for this project.
 */
const partitionBy =
    function <T>(values: T[], predicate: ((t: T) => boolean)): { yes: T[], no: T[] } {
        const yes: T[] = [];
        const no: T[] = [];

        values.forEach(v => {
            if (predicate(v)) {
                yes.push(v);
            } else {
                no.push(v);
            }
        });

        return { yes, no };
    };
