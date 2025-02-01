import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { ViewStyle } from "react-native";

interface PhoenixLogoProps {
    size?: number;
    style?: ViewStyle;
}

export const PhoenixLogo: React.FC<PhoenixLogoProps> = ({ size = 40, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
            <Circle cx="256" cy="256" r="240" fill="#6366F1" opacity="0.1" />
            <Circle cx="256" cy="256" r="220" stroke="#6366F1" strokeWidth="8" />
            <Path
                d="M256 120 C 200 180, 150 220, 150 300 C 150 380, 220 400, 256 380 C 292 400, 362 380, 362 300 C 362 220, 312 180, 256 120Z"
                fill="#6366F1"
            />
            <Path
                d="M256 200 C 200 240, 130 260, 100 220 C 150 280, 200 260, 256 220"
                fill="#818CF8"
            />
            <Path
                d="M256 200 C 312 240, 382 260, 412 220 C 362 280, 312 260, 256 220"
                fill="#818CF8"
            />
            <Path
                d="M256 360 C 220 340, 200 300, 220 260 C 230 300, 256 320, 256 320 C 256 320, 282 300, 292 260 C 312 300, 292 340, 256 360Z"
                fill="#C7D2FE"
            />
        </Svg>
    );
};
