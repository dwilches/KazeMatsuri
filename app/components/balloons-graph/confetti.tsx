import { BalloonHeight, BalloonWidth } from "~/components/balloons-graph/constants";
import type { Balloon } from "~/components/balloons-graph/balloons";

const InitialConfettiSize = 50;
const ConfettiGrowSpeed = 5; // per frame
const ConfettiOpacitySpeed = 0.05; // per frame

export interface Confetti {
    x: number; // position calculated on each frame
    y: number; // position calculated on each frame
    z: number; // sense of depth given by shadow distance
    size: number; // Grows over time
    opacity: number; // in range [0, 1], turns transparent over time
}

/**
 * Confetti grow over time, and fades away. It remains stationary at the pop site.
 */
export const animateConfetti = (confetti: Confetti[]) =>
    confetti
        // Confetti size grows over time, as if it was spreading
        .map(animateSingleConfetti)
        // Remove confetti once it is fully transparent
        .filter(conf => conf.opacity > 0)
        // Sort according to the distance from the wall (i.e. shadow depth)
        .sort((a, b) => a.z - b.z);

/**
 * Grows and fades the confetti.
 */
const animateSingleConfetti = (confetti: Confetti): Confetti => ({
    ...confetti,
    size: confetti.size + ConfettiGrowSpeed,
    opacity: confetti.opacity - ConfettiOpacitySpeed,
});

/**
 * Creates confetti approximately at the center of a balloon's body.
 */
export const createConfettiFromBalloon = (balloon: Balloon): Confetti =>
    ({
        x: balloon.x + BalloonWidth / 2,
        y: balloon.y + BalloonHeight / 4, // Not 2 but 4, as the bottom half is all tail
        z: balloon.z,
        size: InitialConfettiSize,
        opacity: 1, // this will later be animated, it starts fully opaque and the animation slowly turns it transparent
    });
