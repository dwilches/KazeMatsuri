import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "~/providers/audio-provider";
import { useGameControls } from "~/providers/game-controls-provider";
import { useKanaInput } from "~/providers/kana-input-provider/kana-input-provider";
import { SvgShadowFilter } from "~/components/svg-shadow-filter";
import { useVocabulary } from "~/providers/vocabulary-provider/vocabulary-provider";
import type { KanjiWithReadings } from "~/providers/vocabulary-provider/vocabulary";

const BalloonImageUrls = [
    "images/blue-balloon.svg",
    "images/green-balloon.svg",
    "images/pink-balloon.svg",
    "images/purple-balloon.svg",
    "images/red-balloon.svg",
    "images/turquesa-balloon.svg",
    "images/yellow-balloon.svg",
];

interface Balloon {
    imgSrc: string;
    kanji: string; // text visible in screen
    readings: string[]; // text that the user needs to write
    x: number; // position calculated on each frame
    y: number; // position calculated on each frame
    z: number; // sense of depth given by shadow distance
    ySpeed: number;
    xSpeed: number; // Cross-wind speed
}

// Calculate the frame delay in ms to animate at 60fps
const FPS = 60;
const RedrawDelayMs = 1 / FPS * 1000;

const SvgWidth = 1000;
const SvgHeight = 800;

const BalloonWidth = 50;
const BalloonHeight = 100;

// The balloons will sway to the sides as if wind was hitting them, and every so often they'll sway to the opposite
// side. This probability tells how often that direction change happens.
const CrossWindChangeProbability = 0.01;

// This function converts a difficulty level (value in the domain [1, 10]) to a delay in ms (in the range [5000, 1000]).
// As these domain/range are inversely proportional, smaller numbers in the original domain correspond to larger numbers
// in the new domain, which explain the fun math below.
// At difficulty 1, it creates a balloon every 5 seconds. At difficulty 10, a balloon every 1 second.
function difficultyToDelayMs(value: number): number {
    const domain = { min: 1, max: 10 };
    const range = { min: 1000, max: 5000 };

    return range.min + (range.max - range.min) * (domain.max - value) / (domain.max - domain.min);
}

// When used on the balloon's x position, ensures the balloon doesn't go outside the SVG bounds
function clampBalloonX(value: number): number {
    return Math.max(0, Math.min(value, SvgWidth - BalloonWidth));
}

function createNewBalloon(vocabulary: KanjiWithReadings[]): Balloon {
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
}

// Returns a copy of the balloon with an updated position, which is a bit higher up and possibly swaying to the sides
function updateBalloonPosition(b: Balloon): Balloon {
    const windChanged = Math.random() < CrossWindChangeProbability;
    return {
        ...b,
        x: clampBalloonX(b.x + b.xSpeed),
        y: b.y - b.ySpeed,
        xSpeed: b.xSpeed * (windChanged ? -1 : 1),
    };
}

export default function BalloonGraph() {
    // Difficulty will vary from 1 to 10, 1 being the easiest
    const { difficulty, isGamePaused } = useGameControls();
    const { completeKanas } = useKanaInput();
    const { vocabulary } = useVocabulary();

    const [balloons, setBalloons] = useState([] as Balloon[]);

    const elapsedTime = useRef<number>(0);

    const { playBgMusic } = useAudio();

    useEffect(() => {
        playBgMusic();
    }, []);

    // Pop balloons that match the completed kana input by the user
    useEffect(() => {
        setBalloons(oldBalloons => {
            const newBalloons = oldBalloons.filter(b => !b.readings.includes(completeKanas));

            // If there are no more balloons, create a new one so the user doesn't get bored
            if (newBalloons.length === 0 && vocabulary.length > 0) {
                return [createNewBalloon(vocabulary)];
            }

            return newBalloons;
        })
    }, [completeKanas]);

    // Balloon Simulator
    useEffect(() => {
        if (isGamePaused || !vocabulary.length) {
            return;
        }

        // How often to create a balloon, the delay lowers as difficulty grows
        const creationDelayMs = difficultyToDelayMs(difficulty);

        // Create a default balloon so the user doesn't need to wait too long
        if (balloons.length === 0) {
            setBalloons([createNewBalloon(vocabulary)]);
        }

        const interval = setInterval(() => {
            // Create new balloons at intervals according to difficulty.
            elapsedTime.current += RedrawDelayMs;
            if (elapsedTime.current > creationDelayMs) {
                setBalloons(prevValue => ([...prevValue, createNewBalloon(vocabulary)]));
                elapsedTime.current = 0;
            }

            // Animate all balloons each frame
            setBalloons(prevValue =>
                prevValue.map(b => updateBalloonPosition(b))
                    // Remove balloons that have floated away
                    .filter(b => b.y + BalloonHeight > 0)
                    // Sort according to the distance from the wall (i.e. shadow depth)
                    .sort((a, b) => a.z - b.z),
            );
        }, RedrawDelayMs);

        return () => clearInterval(interval);
    }, [difficulty, isGamePaused, vocabulary]);

    const balloonImages = balloons.map((balloon, idx) => {
        return (
            <React.Fragment key={ idx }>
                <image href={ balloon.imgSrc }
                       width={ BalloonWidth }
                       height={ BalloonHeight }
                       x={ balloon.x }
                       y={ balloon.y }
                       filter={ `url(#shadow-${ balloon.z })` }/>
                <text x={ balloon.x + BalloonWidth / 2 }
                      y={ balloon.y }
                      dy={ -10 }
                      textAnchor={ "middle" }
                      filter={ `url(#shadow-${ balloon.z })` }>
                    { balloon.kanji }
                </text>
            </React.Fragment>
        );
    });

    return (
        <svg className="balloons-graph"
             xmlns="http://www.w3.org/2000/svg"
             width={ SvgWidth }
             height={ SvgHeight }
             viewBox={ `0 0 ${ SvgWidth } ${ SvgHeight }` }>
            <defs>
                <SvgShadowFilter filterName={ "shadow-1" } shadowDepth={ 5 }/>
                <SvgShadowFilter filterName={ "shadow-2" } shadowDepth={ 7 }/>
                <SvgShadowFilter filterName={ "shadow-3" } shadowDepth={ 10 }/>
            </defs>

            { balloonImages }
        </svg>
    );
}
