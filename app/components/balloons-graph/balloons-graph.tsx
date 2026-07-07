import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import { useGameControls } from "~/providers/game-controls-provider";
import { useKanaInput } from "~/providers/kana-input-provider/kana-input-provider";
import { SvgShadowFilter } from "~/components/svg-shadow-filter";
import { useVocabulary } from "~/providers/vocabulary-provider/vocabulary-provider";
import {
    animateBalloons,
    type Balloon,
    insertNewBalloon,
    popBalloonsForWord,
} from "~/components/balloons-graph/balloons";
import { animateConfetti, type Confetti } from "~/components/balloons-graph/confetti";
import { BalloonHeight, BalloonWidth, SvgHeight, SvgWidth } from "~/components/balloons-graph/constants";
import { useAudio } from "~/providers/audio-provider";
import styles from "./balloons-graph.module.css";


// Calculate the frame delay in ms to animate at 60fps
export const FPS = 60;
export const RedrawDelayMs = 1 / FPS * 1000;

export function BalloonsGraph() {
    // Difficulty varies from 1 to 10, 1 being the easiest
    const { difficulty, isGamePaused } = useGameControls();
    const { completeKanas } = useKanaInput();
    const { vocabulary } = useVocabulary();

    const { playBalloonPopSound } = useAudio();

    const [balloons, setBalloons] = useState<Balloon[]>([]);
    const [confetti, setConfetti] = useState<Confetti[]>([]);

    const elapsedTime = useRef<number>(0);

    // Pop balloons that match the completed kana input by the user
    useEffect(() => {
        setBalloons(oldBalloons => {
            const { remainingBalloons, newConfetti } = popBalloonsForWord(oldBalloons, completeKanas);
            setConfetti(existingConfetti => [...existingConfetti, ...newConfetti]);

            // If any balloon was popped, play a sound
            newConfetti.forEach(() => playBalloonPopSound());

            return remainingBalloons;
        });
    }, [completeKanas]);

    // If the user doesn't remember the reading of a kanji, clicking on the balloon reveals the answers.
    const onBalloonClicked = (clickedBalloon: Balloon) => {
        setBalloons(currBalloons => {
            return currBalloons.map(someBalloon =>
                someBalloon === clickedBalloon
                    ? { ...clickedBalloon, revealAnswer: !clickedBalloon.revealAnswer }
                    : someBalloon);
        });
    };

    // Allows clicking on the text of balloons to open a page with more information about the kanji.
    // Only frozen balloons can be clicked, to avoid unintended clicks.
    const onBalloonTextClicked = (balloon: Balloon) => {
        if (balloon.revealAnswer) {
            window.open(balloon.url, "_blank", "noreferrer");
        }
    };

    // Creates a new balloon only if there are none left
    const createDefaultBalloon = useEffectEvent(() => {
        if (balloons.length === 0) {
            setBalloons(insertNewBalloon([], vocabulary));
        }
    });

    // The main game simulator. It executes animations step by step every couple milliseconds.
    useEffect(() => {
        if (isGamePaused || !vocabulary.length) {
            return;
        }

        // How often to create a balloon, the delay lowers as difficulty grows
        const creationDelayMs = difficultyToDelayMs(difficulty);

        const interval = setInterval(() => {
            // If there are no balloons left, create a default one so the user doesn't get bored
            createDefaultBalloon();

            // Create new balloons at intervals according to difficulty.
            elapsedTime.current += RedrawDelayMs;
            if (elapsedTime.current > creationDelayMs) {
                setBalloons(ballons => insertNewBalloon(ballons, vocabulary));
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
                       filter={ `url(#shadow-${ balloon.z })` }
                       onClick={ () => onBalloonClicked(balloon) }
                       style={ { cursor: "pointer" } }/>
                <text x={ balloon.x + BalloonWidth / 2 }
                      y={ balloon.y }
                      dy={ -10 }
                      textAnchor={ "middle" }
                      filter={ `url(#shadow-${ balloon.z })` }
                      style={ { cursor: balloon.revealAnswer ? "pointer" : "" } }
                      onClick={ () => onBalloonTextClicked(balloon) }>
                    { balloon.revealAnswer ? balloon.joinedReadings : balloon.kanji }
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
        <svg className={ styles.balloonsGraph }
             xmlns="http://www.w3.org/2000/svg"
             viewBox={ `0 0 ${ SvgWidth } ${ SvgHeight }` }>
            <defs>
                <SvgShadowFilter filterName={ "shadow-1" } shadowDepth={ 5 }/>
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
