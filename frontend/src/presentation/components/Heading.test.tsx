import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Heading from '@/presentation/components/Heading.tsx';

describe('Heading - Unit', (): void => {

    afterEach((): void => {
        cleanup();
    });

    describe('default comportement', (): void => {

        it('should render a h1 component', (): void => {
            render(<Heading>Hello</Heading>);

            expect(screen.getByRole('heading', { level: 1 }))
                .toBeInTheDocument();
        });

        it('should render a h1 component with the correct text', (): void => {
            render(<Heading>Hello</Heading>);

            expect(screen.getByText('Hello'))
                .toBeInTheDocument();
        });

        it('should render a h1 component with the correct className', (): void => {
            render(<Heading>Hello</Heading>);

            expect(screen.getByRole('heading', { level: 1 }))
                .toHaveClass('font-heading', 'text-5xl', 'font-bold');
        });

    });

    describe('custom level', (): void => {

        it.each([
            { level: 1, expectedClasses: ['text-5xl', 'font-bold'] },
            { level: 2, expectedClasses: ['text-3xl', 'font-bold'] },
            { level: 3, expectedClasses: ['text-2xl', 'font-semibold'] },
            { level: 4, expectedClasses: ['text-xl',  'font-medium'] },
        ] as const)('should render a level $level component', ({level, expectedClasses}): void => {
            render(<Heading level={level}>Hello</Heading>);

            const heading: HTMLElement = screen.getByRole('heading', { level });

            expect(heading).toBeInTheDocument();
            expectedClasses.forEach((cls: string): HTMLElement => expect(heading).toHaveClass(cls));
        });

    });

    describe('className additionnelle', (): void => {

        it('ajoute la className personnalisée aux classes existantes', (): void => {
            render(<Heading className='text-red-500'>Hello</Heading>);

            expect(screen.getByRole('heading', { level: 1 }))
                .toHaveClass('text-red-500');
        });

        it('ne supprime pas les classes par défaut quand une className est ajoutée', (): void => {
            render(<Heading className='text-red-500'>Hello</Heading>);

            expect(screen.getByRole('heading', { level: 1 }))
                .toHaveClass('font-heading', 'text-5xl', 'font-bold');
        });

    });

});