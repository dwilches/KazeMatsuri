import React from "react";
import styles from "./config-slider.module.css";

interface ConfigSliderProps {
    iconSrc: string;
    initialValue: number;
    minValue: number;
    maxValue: number;
    onChange: (value: number) => void;
}

export const ConfigSlider = (props: ConfigSliderProps) => {
    const [value, setValue] = React.useState(props.initialValue);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        setValue(newValue);
        props.onChange(newValue);
    };

    return (
        <div className={ styles.configSlider }>
            <img src={ props.iconSrc }
                 width={ 48 } height={ 48 }
                 alt=""/>
            <input type="range"
                   min={ props.minValue } max={ props.maxValue } value={ value }
                   style={ {
                       "--slider-thumb-height": valueToSliderHeight(value, props.minValue, props.maxValue),
                   } as React.CSSProperties }
                   onChange={ handleSliderChange }/>
        </div>
    );
};

/**
 * Adds an animation to the sliders thumb, making the thumb larger as the selected value increases.
 */
const valueToSliderHeight = (value: number, minValue: number, maxValue: number): string => {
    // Scale input value between 0 and 1
    const scaledValue = (value - minValue) / (maxValue - minValue);

    // height -> [0.8, 1.2]
    const height = scaledValue * (1.2 - 0.8) + 0.8;
    return `${ height }rem`;
};
