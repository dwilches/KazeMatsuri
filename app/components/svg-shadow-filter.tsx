interface FilterProps {
    filterName: string;
    shadowDepth: number;
}

export const SvgShadowFilter = ({ filterName, shadowDepth }: FilterProps) => {
    return (
        <filter id={ filterName } x="-20%" y="-20%" width="140%" height="140%">
            { /* Shadow */ }
            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
            <feOffset dx={ shadowDepth } dy={ shadowDepth } result="offsetBlur"/>
            <feFlood flood-color="#000000" flood-opacity="0.2"/>
            <feComposite in2="offsetBlur" operator="in" result="dropShadow"/>

            { /* Put shadow under original image */ }
            <feMerge>
                <feMergeNode in="dropShadow"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    );
};
