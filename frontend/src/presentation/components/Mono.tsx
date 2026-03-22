import { ReactNode } from 'react';

interface MonoProps {
    level?: 1 | 2 | 3 | 4 | 5;
    children: ReactNode;
    className?: string;
}

type MonoTag = "h1" | "h2" | "h3" | "h4" | "p";

const styles = {
    1: 'text-5xl font-bold',
    2: 'text-3xl font-bold',
    3: 'text-2xl font-bold',
    4: 'text-xl font-medium',
    5: ''
};

export default function Mono({ level = 5, children, className = '' }: MonoProps): ReactNode {
    const Tag = (level === 5 ? "p" : `h${level}`) as MonoTag;
    return (
        <Tag className={`font-mono ${styles[level]} ${className}`}>
            {children}
        </Tag>
    );
};
