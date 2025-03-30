// start of frontend/components/widgets/BaseWidget.tsx
'use client';
import React, { useState } from 'react';
import IconChevronDown from '@/components/icon/icon-chevron-down';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseWidgetProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    isCollapsible?: boolean;
    isLoading?: boolean;
}

const BaseWidget: React.FC<BaseWidgetProps> = ({
    title,
    children,
    className = '',
    isCollapsible = true,
    isLoading = false
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`panel h-full ${className}`}>
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">{title}</h5>
                {isCollapsible && (
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-black/70 hover:text-primary dark:text-white/70"
                    >
                        <IconChevronDown className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isLoading ? (
                            <div className="animate-pulse">
                                <div className="h-32 bg-gray-200 rounded dark:bg-gray-700"></div>
                            </div>
                        ) : (
                            children
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BaseWidget;
// end of frontend/components/widgets/BaseWidget.tsx