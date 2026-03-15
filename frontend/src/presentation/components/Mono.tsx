interface MonoProps {
    level?: 1 | 2 | 3 | 4 | 5;
    children: React.ReactNode;
    className?: string;
}

const styles = {
    1: "text-5xl font-bold",
    2: "text-3xl font-bold",
    3: "text-2xl font-bold",
    4: "text-xl font-medium",
    5: ""
};

export default function Mono({ level = 5, children, className = "" }: MonoProps) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
        <Tag className={`font-mono ${styles[level]} ${className}`}>
            {children}
        </Tag>
    );
};
