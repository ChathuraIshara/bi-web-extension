import React from 'react';
import Lottie from 'react-lottie';

import animationData from './data.json';

export interface PreloaderProps {
    h: number;
    w: number;
};

export function Preloader(props: PreloaderProps) {
    const { h, w } = props;

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Lottie options={defaultOptions} height={`${h}%`} width={`${w}%`}/>
    );
}
