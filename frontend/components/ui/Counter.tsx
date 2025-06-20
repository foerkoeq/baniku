// start of frontend/components/counter/Counter.tsx
'use client';
import React from 'react';
import CountUp from 'react-countup';

interface CounterProps {
    start?: number;
    end: number;
    duration?: number;
    title?: string;
    icon?: React.ReactElement;
    variant?: 'square' | 'circle';
    size?: 'sm' | 'md';
    className?: string;
    color?: 'primary' | 'success' | 'info' | 'danger' | 'warning';
}

const Counter: React.FC<CounterProps> = ({
    start = 0,
    end,
    duration = 7,
    title,
    icon,
    variant = 'square',
    size = 'md',
    className = '',
    color = 'primary'
}) => {
    const sizeClasses = {
        sm: 'h-[70px] w-[70px]',
        md: 'sm:h-[100px] sm:w-[100px] h-[70px] w-[70px]'
    }[size];

    const shapeClasses = variant === 'circle' ? 'rounded-full' : 'rounded';

    const colorClasses = `text-${color}`;

    return (
        <div className={className}>
            <div className={`
                flex flex-col justify-center border border-white-light 
                shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] 
                dark:border-[#1b2e4b]
                ${sizeClasses} 
                ${shapeClasses}
            `}>
                <CountUp 
                    start={start} 
                    end={end} 
                    duration={duration} 
                    className={`text-center text-xl sm:text-3xl ${colorClasses}`}
                />
            </div>
            {(title || icon) && (
                <h4 className="mt-4 text-center text-xs font-semibold text-[#3b3f5c] dark:text-white-dark sm:text-[15px]">
                    {icon && React.cloneElement(icon, { className: 'mx-auto mb-2 text-primary sm:h-6 sm:w-6' })}
                    {title}
                </h4>
            )}
        </div>
    );
};

export default Counter;

export const CounterGroup: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <div className={`mx-auto mb-5 grid max-w-[900px] grid-cols-3 justify-items-center gap-3 ${className}`}>
            {children}
        </div>
    );
};
// end of frontend/components/counter/Counter.tsx