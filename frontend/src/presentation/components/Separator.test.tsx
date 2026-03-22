import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Separator from "@/presentation/components/Separator.tsx";

describe('Separator - Unit', (): void => {

    afterEach((): void => {
        cleanup();
    });

    it('should render the separator text', (): void => {
        render(<Separator />);

        expect(screen.getByText('ou')).toBeInTheDocument();
    });

    it('should render the wrapper with correct classes', (): void => {
        render(<Separator />);

        const wrapper = screen.getByText('ou').parentElement;

        expect(wrapper).toHaveClass('flex', 'items-center', 'gap-4');
    });

    it('should render the "ou" span with correct classes', (): void => {
        render(<Separator />);

        const span = screen.getByText('ou');

        expect(span.tagName).toBe('SPAN');
        expect(span).toHaveClass('text-foreground-500', 'text-sm');
    });

});