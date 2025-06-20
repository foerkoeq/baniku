import { FC } from 'react';

interface IconChevronDownProps {
    className?: string;
}

const IconChevronDown: FC<IconChevronDownProps> = ({ className }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M12 15L8.70711 11.7071C8.31658 11.3166 8 10.6834 8 10V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V10C16 10.6834 15.6834 11.3166 15.2929 11.7071L12 15Z" fill="currentColor" />
        </svg>
    );
};

export default IconChevronDown;
