import { IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';
import { ActionIcon, Group, Image, Text } from '@mantine/core';
import './Footer.scss'
import { footerLinks } from '@devmate/app/utils/utility';
import useWindowSize from '@devmate/app/hooks/useWindowSizes';
import Link from 'next/link';


const Footer: React.FC = () => {
    const { width } = useWindowSize()
    const items = footerLinks.map((link) => (
        <Link
            key={link.label}
            href={link.link}
            className='footer-link'
        >
            <Text
                c="dimmed"
                key={link.label}
                lh={1}
                size="sm"
            >
                {link.label}
            </Text>
        </Link>
    ));

    return (
        <div className="footer">
            <div className="footer-inner">
                {width > 576 && <Image h={40} w={135} src="./devmate-full-name-logo.jpeg" alt="App Logo" className="app-logo" />}

                <Group className="footer-links">{items}</Group>

                <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" variant="default" radius="xl"
                        onClick={() => window.open("https://www.linkedin.com/in/robert-macwan-bb0b23192", "_blank")}
                    >
                        <IconBrandLinkedin size={18} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl"
                        onClick={() => window.open("https://www.instagram.com/robert.macvvan/", "_blank")}
                    >
                        <IconBrandInstagram size={18} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </div>
        </div>
    );
}

export default Footer;
