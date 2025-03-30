import { FC } from 'react';

interface IconEyeOffProps {
    className?: string;
}

const IconEyeOff: FC<IconEyeOffProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M12 17.5C13.7614 17.5 15.5 16.2614 15.5 15C15.5 13.7386 13.7614 12.5 12 12.5C10.2386 12.5 8.5 13.7386 8.5 15C8.5 16.2614 10.2386 17.5 12 17.5Z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

export default IconEyeOff;

