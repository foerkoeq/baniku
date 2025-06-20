// start of frontend/components/tooltips/Tooltip.tsx
'use client';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React from 'react';

interface TooltipProps {
    children: React.ReactElement;
    content: React.ReactNode;
    theme?: 'primary' | 'success' | 'info' | 'danger' | 'warning' | 'secondary' | 'dark';
    placement?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: 'mouseenter' | 'click' | 'focusin';
    delay?: number;
    animation?: boolean;
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    theme,
    placement = 'top',
    trigger = 'mouseenter',
    delay,
    animation = true,
    className = '',
    ...props
}) => {
    // Style untuk tema tooltip
    const getThemeStyle = () => {
        if (!theme) return {};

        return {
            'data-tippy-theme': theme,
            className: `tippy-${theme} ${className}`
        };
    };

    return (
        <Tippy
            content={content}
            placement={placement}
            trigger={trigger}
            delay={delay}
            animation={animation}
            {...getThemeStyle()}
            {...props}
        >
           <span className="inline-block">{children}</span>
        </Tippy>
    );
};

// Style untuk tema tooltip - tambahkan di global CSS atau styled-components
const tooltipStyles = `
.tippy-box[data-theme~='primary'] {
    background-color: var(--primary);
    color: #fff;
}
.tippy-box[data-theme~='success'] {
    background-color: var(--success);
    color: #fff;
}
.tippy-box[data-theme~='info'] {
    background-color: var(--info);
    color: #fff;
}
.tippy-box[data-theme~='danger'] {
    background-color: var(--danger);
    color: #fff;
}
.tippy-box[data-theme~='warning'] {
    background-color: var(--warning);
    color: #fff;
}
.tippy-box[data-theme~='secondary'] {
    background-color: var(--secondary);
    color: #fff;
}
.tippy-box[data-theme~='dark'] {
    background-color: var(--dark);
    color: #fff;
}

/* Arrow styles untuk setiap tema */
.tippy-box[data-theme~='primary'] .tippy-arrow {
    color: var(--primary);
}
.tippy-box[data-theme~='success'] .tippy-arrow {
    color: var(--success);
}
.tippy-box[data-theme~='info'] .tippy-arrow {
    color: var(--info);
}
.tippy-box[data-theme~='danger'] .tippy-arrow {
    color: var(--danger);
}
.tippy-box[data-theme~='warning'] .tippy-arrow {
    color: var(--warning);
}
.tippy-box[data-theme~='secondary'] .tippy-arrow {
    color: var(--secondary);
}
.tippy-box[data-theme~='dark'] .tippy-arrow {
    color: var(--dark);
}
`;

export { tooltipStyles };
export default Tooltip;
// end of frontend/components/tooltips/Tooltip.tsx