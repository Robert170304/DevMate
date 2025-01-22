import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
import { ActionIcon, Anchor, Group, Image } from '@mantine/core';
import './Footer.scss'
import { footerLinks } from '@devmate/app/utils/utility';
import useWindowSize from '@devmate/app/hooks/useWindowSizes';


const Footer: React.FC = () => {
    const { width } = useWindowSize()
    const items = footerLinks.map((link) => (
        <Anchor
            c="dimmed"
            key={link.label}
            href={link.link}
            lh={1}
            // onClick={(event) => event.preventDefault()}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className="footer">
            <div className="footer-inner">
                {width > 576 && <Image h={40} w={135} src="./devmate-full-name-logo.jpeg" alt="App Logo" className="app-logo" />}

                <Group className="footer-links">{items}</Group>

                <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <IconBrandTwitter size={18} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <IconBrandYoutube size={18} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <IconBrandInstagram size={18} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </div>
        </div>
    );
}

export default Footer;
