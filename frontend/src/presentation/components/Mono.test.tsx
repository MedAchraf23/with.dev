import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Mono from '@/presentation/components/Mono.tsx';

describe('Mono - Unit', (): void => {

    afterEach((): void => {
        cleanup();
    });

    describe('default comportement', (): void => {

        it('should render a mono paragraph', (): void => {
            render(<Mono>Hello</Mono>);

            expect(screen.getByRole('paragraph').tagName)
                .toBe('P');
        });

        it('should render a mono component with the correct text', (): void => {
            render(<Mono>Hello</Mono>);

            expect(screen.getByText('Hello'))
                .toBeInTheDocument();
        });

        it('should render a mono component with correct classNames', (): void => {
            render(<Mono>Hello</Mono>);

            expect(screen.getByText('Hello'))
                .toHaveClass('font-mono');
        });

    });

    describe('custom level', (): void => {
        
        it.each([
            { level: 1, expectedClasses: ['text-5xl', 'font-bold'] },
            { level: 2, expectedClasses: ['text-3xl', 'font-bold'] },
            { level: 3, expectedClasses: ['text-2xl', 'font-bold'] },
            { level: 4, expectedClasses: ['text-xl',  'font-medium'] },
        ] as const)('should render a level $level mono component with right classes', ({ level, expectedClasses }): void => {
            render(<Mono level={level}>Hello</Mono>);

            const mono: HTMLElement = screen.getByText('Hello');

            expect(mono).toBeInTheDocument();
            expectedClasses.forEach((cls: string): HTMLElement => expect(mono).toHaveClass(cls));
        });

        it('should render a level 5 mono component as a paragraph', (): void => {
            render(<Mono level={5}>Hello</Mono>);

            const mono: HTMLElement = screen.getByText('Hello');

            expect(mono.tagName).toBe('P');
            expect(mono).toHaveClass('font-mono');
        });
        
    });

    describe('className additionnelle', (): void => {

        it('ajoute la className personnalisée aux classes existantes', (): void => {
            render(<Mono className='text-red-500'>Hello</Mono>);

            expect(screen.getByText('Hello'))
                .toHaveClass('text-red-500');
        });

        it('ne supprime pas les classes par défaut quand une className est ajoutée', (): void => {
            render(<Mono className='text-red-500'>Hello</Mono>);

            expect(screen.getByText('Hello'))
                .toHaveClass('font-mono');
        });

    });

});