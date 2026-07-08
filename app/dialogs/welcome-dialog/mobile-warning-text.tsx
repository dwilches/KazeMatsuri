import React from "react";

import styles from "./welcome-dialog.module.css";

export const MobileWarningText = () => {
    return (<>
        <h1 className={ "text-amber-500" }>Wait! It looks like you're on mobile.</h1>
        <p className={ styles.altTextColor }>
            This game is designed for devices with physical keyboards (such as PCs, laptops, and some mobile devices).
        </p>
        <p>
            The gameplay is built around being able to watch the screen while typing, so it doesn't work
            well with virtual keyboards.
        </p>
        <p className={ styles.altTextColor }>
            You can still continue if your device has a physical keyboard.
        </p>
    </>);
};
