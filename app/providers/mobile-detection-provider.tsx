import React, { useEffect } from "react";

// Look at the UserAgent and try to detect if the game is running on a mobile device.
// This is a subset of http://detectmobilebrowsers.com/ which, for my purpose, looked excessive
const mobileRegex = /Mobile|Android|BlackBerry|iPhone|iPad|iPod|Opera Mini/i;

interface MobileDetectionProps {
    isMobile: boolean;
}

export const useMobileDetection = (): MobileDetectionProps => {

    const [isMobile, setIsMobile] = React.useState(false);

    // Try to detect if the game is running on a mobile device by looking at the browser's UserAgent.
    // This is a detection heuristic, not 100% accurate but good enough for my use case.
    useEffect(() => {
        if (typeof window !== "undefined" && window.navigator?.userAgent.match(mobileRegex)) {
            setIsMobile(true);
        }
    }, []);

    return {
        isMobile,
    };
};
