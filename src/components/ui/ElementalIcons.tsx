/**
 * src/components/ui/ElementalIcons.tsx
 * 
 * Símbolos literais dos quatro elementos (Ar, Terra, Fogo, Água).
 * Refinados para fidelidade absoluta à imagem original.
 */

import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

export const AirIcon: React.FC<IconProps> = ({ size = 100, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="50" cy="50" r="46" fill="#EBF5FB" stroke="#AED6F1" strokeWidth="2" />
        <g stroke="#3498DB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {/* Top Spiral */}
            <path d="M50 40C50 30 40 25 35 30C30 35 35 45 45 42C50 40 48 35 45 35" />
            {/* Bottom Left Spiral */}
            <path d="M35 65C25 65 20 55 25 50C30 45 40 50 37 60C35 65 30 63 30 60" />
            {/* Bottom Right Spiral */}
            <path d="M65 65C75 65 80 55 75 50C70 45 60 50 63 60C65 65 70 63 70 60" />
        </g>
    </svg>
);

export const EarthIcon: React.FC<IconProps> = ({ size = 100, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="50" cy="50" r="46" fill="#F1F8E9" stroke="#DCEDC8" strokeWidth="2" />
        <g stroke="#33691E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* The "Mountain" Shape (Trapezoid) */}
            <path d="M25 75L35 30H65L75 75H25Z" />
            {/* Inner Circle at the top */}
            <circle cx="50" cy="48" r="8" strokeWidth="4" />
            {/* Bottom Design (Rectangle with bars) */}
            <rect x="38" y="62" width="24" height="13" strokeWidth="4" />
            <path d="M46 62V75M54 62V75" strokeWidth="4" />
        </g>
    </svg>
);

export const FireIcon: React.FC<IconProps> = ({ size = 100, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="50" cy="50" r="46" fill="#FDEDEC" stroke="#FADBD8" strokeWidth="2" />
        <g stroke="#922B21" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* Refined Three-Flame Path */}
            <path d="M50 82C30 82 20 70 20 60C20 50 25 40 30 35C30 50 40 55 50 30C60 55 70 50 70 35C75 40 80 50 80 60C80 70 70 82 50 82Z" />
            {/* Inner Flame Detail */}
            <path d="M50 75C42 75 35 68 35 60C35 55 40 50 45 45C45 55 50 58 50 50C50 58 55 55 55 45C60 50 65 55 65 60C65 68 58 75 50 75Z" strokeWidth="3" />
        </g>
    </svg>
);

export const WaterIcon: React.FC<IconProps> = ({ size = 100, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="50" cy="50" r="46" fill="#EBF5FB" stroke="#AED6F1" strokeWidth="2" />
        <g stroke="#1B4F72" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer Circle of the design */}
            <circle cx="50" cy="50" r="38" />
            {/* Waves inside */}
            <path d="M25 55C35 40 45 40 55 55C65 70 75 70 85 55" strokeWidth="4" />
            <path d="M20 65C30 50 40 50 50 65C60 80 70 80 80 65" strokeWidth="4" />
            <path d="M30 45C40 30 50 30 60 45C70 60 80 60 90 45" strokeWidth="4" />
        </g>
    </svg>
);
