import React from 'react';
import Link from 'next/link';
import IconHome from '@/components/icon/icon-home';
import IconChevronRight from '@/components/icon/icon-chevron-right';

export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactElement;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  homeLink?: string;
  showHome?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  homeLink = '/dashboard',
  showHome = true,
}) => {
  return (
    <nav className={`mb-5 ${className}`}>
      <ol className="flex flex-wrap items-center gap-y-2 text-sm font-medium">
        {showHome && (
          <li className="flex items-center">
            <Link 
              href={homeLink}
              className="flex items-center text-primary hover:text-primary/70 dark:text-white-dark dark:hover:text-white-dark/70"
            >
              <IconHome className="h-4 w-4" />
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              {(showHome || index > 0) && (
                <IconChevronRight 
                  className="mx-2 h-4 w-4 text-gray-400 rtl:rotate-180" 
                />
              )}
              
              {/* Item */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-primary dark:text-white-dark/70 dark:hover:text-primary"
                >
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.title}
                </Link>
              ) : (
                <span className={`flex items-center ${
                  isLast 
                    ? 'text-gray-800 dark:text-white' 
                    : 'text-gray-600 dark:text-white-dark/70'
                }`}>
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.title}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;