import { useEffect, useRef, useState } from "react";
import { useAudio } from "~/providers/audio-provider";
import { useGameControls } from "~/providers/game-controls-provider";

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
    x: number; // position calculated on each frame
    y: number; // position calculated on each frame
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

function createNewBalloon(difficulty: number): Balloon {
    const randomImgIdx = Math.floor(Math.random() * BalloonImageUrls.length);
    return {
        imgSrc: BalloonImageUrls[randomImgIdx],
        x: Math.random() * (SvgWidth - BalloonWidth),
        y: SvgHeight,
        xSpeed: 2 * (Math.random() - 0.5), // Side-wind speed between -1 and 1
        ySpeed: 1 + Math.random(),
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

export default function GameGraph() {
    // Difficulty will vary from 1 to 10, 1 being the easiest
    const { difficulty, isGamePaused } = useGameControls();
    const [balloons, setBalloons] = useState([] as Balloon[]);

    const elapsedTime = useRef<number>(0);

    const { playBgMusic } = useAudio();

    useEffect(() => {
        playBgMusic();
    }, []);

    // Balloon Simulator
    useEffect(() => {
        if (isGamePaused) {
            return;
        }

        // How often we'll create a balloon, the delay lowers as difficulty grows
        const creationDelayMs = difficultyToDelayMs(difficulty);

        // Create a default balloon so the user doesn't need to wait too long
        if (balloons.length === 0) {
            setBalloons([createNewBalloon(difficulty)]);
        }

        const interval = setInterval(() => {
            // Create new balloons at intervals according to difficulty.
            elapsedTime.current += RedrawDelayMs;
            if (elapsedTime.current > creationDelayMs) {
                setBalloons(prevValue => ([...prevValue, createNewBalloon(difficulty)]));
                elapsedTime.current = 0;
            }

            // Animate all balloons each frame
            setBalloons(prevValue =>
                prevValue.map(b => updateBalloonPosition(b))
                    // Remove balloons that have floated away
                    .filter(b => b.y + BalloonHeight > 0));
        }, RedrawDelayMs);

        return () => clearInterval(interval);
    }, [difficulty, isGamePaused]);

    const balloonImages = balloons.map((balloon, idx) => {
        return (
            <image href={ balloon.imgSrc }
                   key={ idx }
                   width={ BalloonWidth }
                   height={ BalloonHeight }
                   x={ balloon.x }
                   y={ balloon.y }/>);
    });

    return (
        <svg className="game-graph"
             xmlns="http://www.w3.org/2000/svg"
             width={ SvgWidth }
             height={ SvgHeight }
             viewBox={ `0 0 ${ SvgWidth } ${ SvgHeight }` }>
            { balloonImages }
        </svg>
    );
}
