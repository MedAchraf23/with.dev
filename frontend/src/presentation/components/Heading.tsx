import { ReactNode } from "react";

interface HeadingProps {
    level?: 1 | 2 | 3 | 4;
    children: ReactNode;
    className?: string;
}

const styles = {
    1: "text-5xl font-bold",
    2: "text-3xl font-bold",
    3: "text-2xl font-semibold",
    4: "text-xl font-medium",
};

export default function Heading({ level = 1, children, className = "" }: HeadingProps): ReactNode {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
        <Tag className={`font-heading ${styles[level]} ${className}`}>
            {children}
        </Tag>
    );
};
