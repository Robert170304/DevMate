'use client'
import { BackgroundImage, Box, Button, Center, Group, Title } from '@mantine/core';
import './HeroSection.scss';
import FeatureCards from '../FeatureCards/FeatureCards';

const HeroSection: React.FC = () => {
    return (
        <div className="hero-inner">
            <div className="content">
                <Title className="title">
                    Code, Collaborate, Create <br /> Together with <span className="highlight">AI</span>
                </Title>
                {/* <Text c="dimmed" mt="md">
                        Build fully functional accessible web applications faster than ever – Mantine includes
                        more than 120 customizable components and hooks to cover you in any situation
                    </Text> */}

                <Group mt={30} justify="center" >
                    <Button radius="xl" size="md" className="control">
                        Get started
                    </Button>
                    <Button variant="default" radius="xl" size="md" className="control">
                        Explore Demo
                    </Button>
                </Group>
            </div>
            <FeatureCards />

            <Box mah={1000} className='hero-box' >
                <BackgroundImage
                    src="./hero-background.webp"
                    radius="sm"
                    w="100%"
                    h="100%"
                >
                    <Center p="xs" h="100%" className='hero-center' >
                        <video className="hero-video" autoPlay loop muted width="100%" height="90%" >
                            <source src="/hero-dark-lg.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Center>
                </BackgroundImage>
            </Box>
        </div>
    );
}

export default HeroSection;
