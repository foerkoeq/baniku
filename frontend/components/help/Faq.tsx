'use client';
import React from 'react';
import { Disclosure } from '@headlessui/react';
import IconCaretDown from '@/components/icon/icon-caret-down';

export interface FaqItem {
    question: string;
    answer: string;
}

interface FaqProps {
    items: FaqItem[];
    className?: string;
}

const Faq: React.FC<FaqProps> = ({ items, className = '' }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item, index) => (
                <Disclosure key={index}>
                    {({ open }) => (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium text-left">{item.question}</span>
                                <IconCaretDown className={`w-5 h-5 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {item.answer}
                            </Disclosure.Panel>
                        </div>
                    )}
                </Disclosure>
            ))}
        </div>
    );
};

export default Faq;