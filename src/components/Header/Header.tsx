'use client';
import { Burger, Button, Flex, Group, Image, Title, UnstyledButton } from '@mantine/core';
import './Header.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGithub } from "react-icons/fa";
import { signIn, useSession } from 'next-auth/react';
import { headerLinks } from '@devmate/app/utils/utility';
import { useEffect, useState } from 'react';
import useWindowSize from '@devmate/app/hooks/useWindowSizes';
import { useDisclosure } from '@mantine/hooks';


const Header: React.FC = () => {
    const { width } = useWindowSize()
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const { data: session } = useSession();
    const [opened, { toggle }] = useDisclosure();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const items = headerLinks.map((link) => (
        <Link key={link.label} href={link.link} className="link" scroll={false}>
            {link.label}
        </Link>
    ));

    return (
        <header className={`main-site__header ${scrolled ? 'scrolled' : ''}`}>
            <div className="inner">
                <Flex gap={{ base: 'sm', md: 0 }} justify="center" align="center" wrap="nowrap" rowGap={0} columnGap={0} >
                    <Image mt="3px" h={35} w={35} src="/app-icon-non-bg.svg" alt="App Logo" className="app-logo" />
                    <UnstyledButton onClick={() => !session && router.push('/')}>
                        <Title order={width <= 768 ? 3 : 2} className="app-name">DevMate</Title>
                    </UnstyledButton>
                </Flex>

                {!session && width > 768 && (
                    <Group gap="md">
                        {items}
                        <Button
                            variant="filled"
                            color="dark"
                            radius="md"
                            size="md"
                            className="githubLoginBtn"
                            onClick={() => signIn("github", { callbackUrl: "/workspace" })}
                        >
                            <FaGithub size={16} />
                            <span>Login with GitHub</span>
                        </Button>
                    </Group>
                )}
                {!session && width <= 768 && (
                    <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
                )}
            </div>
        </header>
    );
};

export default Header;
