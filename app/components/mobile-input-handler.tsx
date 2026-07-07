import React, { useEffect, useRef } from "react";

// Look at the UserAgent and try to detect if the game is running on a mobile device.
// This is a subset of http://detectmobilebrowsers.com/ which, for my purpose, looked excessive
const mobileRegex = /Mobile|Android|BlackBerry|iPhone|iPad|iPod|Opera Mini/i;

export const MobileInputHandler = () => {

    // To capture focus on mobile, I'll create a hidden input field and focus it, triggering the native keyboard
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const [isMobile, setIsMobile] = React.useState(false);

    // This component will only be used if the game is running on mobile
    useEffect(() => {
        if (!window.navigator?.userAgent.match(mobileRegex)) {
            return;
        }

        setIsMobile(true);

        const onClickHandler = () => hiddenInputRef.current?.focus();

        // Each time the user interacts with the page, focus the hidden input
        document.addEventListener("click", onClickHandler);

        return () => document.removeEventListener("click", onClickHandler);
    }, []);

    // Each time the hidden input is typed into, clear it, this is to avoid it accumulating a lot of text
    const handleChange = () => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.value = "";
        }
    };

    // Locate the input field off the screen bounds, make it small and transparent
    const styles: React.CSSProperties = {
        position: "absolute",
        top: "-1rem",
        left: "-1rem",
        opacity: 0,
        height: "1px",
        width: "1px",
        zIndex: -1,
        fontSize: "16px",
    };

    return (
        <>
            { isMobile &&
                <input ref={ hiddenInputRef }
                       type="text"
                       style={ styles }
                       autoComplete="off"
                       autoCapitalize="off"
                       onChange={ handleChange }/>
            }
        </>
    );
};
