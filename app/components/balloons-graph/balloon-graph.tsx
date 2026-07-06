import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "~/providers/audio-provider";
import { useGameControls } from "~/providers/game-controls-provider";
import { useKanaInput } from "~/providers/kana-input-provider/kana-input-provider";
import { SvgShadowFilter } from "~/components/svg-shadow-filter";
import { useVocabulary } from "~/providers/vocabulary-provider/vocabulary-provider";
import {
    animateBalloons,
    type Balloon,
    createNewBalloon,
    popBalloonsForWord,
} from "~/components/balloons-graph/balloons";
import { animateConfetti, type Confetti } from "~/components/balloons-graph/confetti";
import { BalloonHeight, BalloonWidth, SvgHeight, SvgWidth } from "~/components/balloons-graph/constants";

// Calculate the frame delay in ms to animate at 60fps
export const FPS = 60;
export const RedrawDelayMs = 1 / FPS * 1000;

export default function BalloonGraph() {
    // Difficulty will vary from 1 to 10, 1 being the easiest
    const { difficulty, isGamePaused } = useGameControls();
    const { completeKanas } = useKanaInput();
    const { vocabulary } = useVocabulary();

    const [balloons, setBalloons] = useState<Balloon[]>([]);
    const [confetti, setConfetti] = useState<Confetti[]>([]);

    const elapsedTime = useRef<number>(0);

    const { playBgMusic } = useAudio();

    useEffect(() => {
        playBgMusic();
    }, []);

    // Pop balloons that match the completed kana input by the user
    useEffect(() => {
        setBalloons(oldBalloons => {
            const { remainingBalloons, newConfetti } = popBalloonsForWord(oldBalloons, completeKanas);

            setConfetti(existingConfetti => [...existingConfetti, ...newConfetti]);

            // If there are no more balloons, create a new one so the user doesn't get bored
            if (remainingBalloons.length === 0 && vocabulary.length > 0) {
                return [createNewBalloon(vocabulary)];
            }

            return remainingBalloons;
        });
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

            // Animate objects each frame
            setBalloons(animateBalloons);
            setConfetti(animateConfetti);
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
    const confettiImages = confetti.map((conf, idx) => {
        return (
            <image key={ idx }
                   href="images/confetti.svg"
                   width={ conf.size }
                   height={ conf.size }
                   x={ conf.x - conf.size / 2 }
                   y={ conf.y - conf.size / 2 }
                   opacity={ conf.opacity }
                   filter={ `url(#shadow-${ conf.z })` }/>
        );
    });

    return (
        <svg className="balloons-graph"
             xmlns="http://www.w3.org/2000/svg"
             viewBox={ `0 0 ${ SvgWidth } ${ SvgHeight }` }>
            <defs>
                <SvgShadowFilter filterName={ "shadow-1" } shadowDepth={ 5 }/>
                <SvgShadowFilter filterName={ "shadow-2" } shadowDepth={ 7 }/>
                <SvgShadowFilter filterName={ "shadow-3" } shadowDepth={ 10 }/>
            </defs>

            { balloonImages }
            { confettiImages }
        </svg>
    );
}


/**
 * This function converts a difficulty level (value in the domain [1, 10]) to a delay in ms (in the range [5000, 1000]).
 * As these domain/range are inversely proportional, smaller numbers in the original domain correspond to larger numbers
 * in the new domain, which explain the fun math below.
 * At difficulty 1, it creates a balloon every 5 seconds. At difficulty 10, a balloon every 1 second.
 */
function difficultyToDelayMs(value: number): number {
    const domain = { min: 1, max: 10 };
    const range = { min: 1000, max: 5000 };

    return range.min + (range.max - range.min) * (domain.max - value) / (domain.max - domain.min);
}
