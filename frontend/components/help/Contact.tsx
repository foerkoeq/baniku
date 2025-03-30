'use client';
import React from 'react';

export interface ContactItem {
    icon: React.ReactElement;
    title: string;
    value: string;
    link: string;
}

interface ContactProps {
    items: ContactItem[];
    className?: string;
}

const Contact: React.FC<ContactProps> = ({ items, className = '' }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
            {items.map((contact, index) => (
                <a
                    key={index}
                    href={contact.link}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors"
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {contact.icon}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.title}</p>
                        <p className="font-medium">{contact.value}</p>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default Contact;