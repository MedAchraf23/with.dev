import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import Mono from '@/presentation/components/Mono.tsx';
import { useAuth } from '@/features/authentification/hooks/use-auth.hook.ts';

interface NavigationLink {
    href: string;
    label: string;
}

const LINKS: NavigationLink[] = [
    { href: '/offres', label: 'Offres' },
    { href: '/profil', label: 'Mon profil' },
];

export default function AppNavbar(): ReactNode {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleSignOut = async (): Promise<void> => {
        await signOut();
        navigate('/auth', { replace: true });
    };

    return (
        <Navbar isBordered maxWidth="xl">
            <NavbarBrand>
                <Mono level={4}>with.dev</Mono>
            </NavbarBrand>

            <NavbarContent justify="center">
                {LINKS.map((link: NavigationLink): JSX.Element => (
                    <NavbarItem key={link.href} isActive={pathname === link.href}>
                        <Link
                            href={link.href}
                            color={pathname === link.href ? 'primary' : 'foreground'}
                            aria-current={pathname === link.href ? 'page' : undefined}
                        >
                            {link.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button variant="light" onPress={handleSignOut}>
                        Se déconnecter
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
