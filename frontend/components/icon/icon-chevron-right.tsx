import { FC } from 'react';

interface IconChevronRightProps {
    className?: string;
}

const IconChevronRight: FC<IconChevronRightProps> = ({ className }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M9 6L13.2929 10.2929C13.6834 10.6834 13.6834 11.3166 13.2929 11.7071L9 16" fill="currentColor" />
        </svg>
    );
};

export default IconChevronRight;
