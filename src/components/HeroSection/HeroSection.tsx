'use client'
import { useEffect } from "react";
import { BackgroundImage, Box, Center, Flex, Text, Title } from '@mantine/core';
import './HeroSection.scss';
import FeatureCards from '../FeatureCards/FeatureCards';
import { usePathname, useSearchParams } from "next/navigation";

const HeroSection: React.FC = () => {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const showFeatures = searchParams.get("features");
        if (showFeatures === "true") {
            const element = document.getElementById("features-section");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            window.history.replaceState(null, "", "/");
        }
    }, [pathName, searchParams]);
    return (
        <div className="hero-inner">
            <div className="hero-section__content">
                <Title className="hero-section__title">
                    Code, Collaborate, Create <br /> Together with <span className="hero-section__highlight">AI</span>
                </Title>
                {/* <Text c="dimmed" mt="md">
                        Build fully functional accessible web applications faster than ever – Mantine includes
                        more than 120 customizable components and hooks to cover you in any situation
                    </Text> */}

                {/* <Group mt={30} justify="center" >
                    <Button radius="xl" size="md" className="control">
                        Get started
                    </Button>
                    <Button variant="default" radius="xl" size="md" className="control">
                        Explore Demo
                    </Button>
                </Group> */}
            </div>
            <FeatureCards />
            <Flex direction="column" gap={25} >
                <Title className="hero-section__title" mt="30px">
                    AI-Powered Code Modification
                </Title>
                <Box mah={1000} className='hero-box' >
                    <BackgroundImage
                        src="./hero-background.webp"
                        radius="sm"
                        w="100%"
                        h="100%"
                    >
                        <Center p="xs" h="100%" className='hero-center' >
                            <video className="hero-video" autoPlay loop muted width="100%" height="90%" >
                                <source src="/ai-modify-code.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Center>
                    </BackgroundImage>
                </Box>
                <Title className="hero-section__title" mt="30px">
                    AI-Powered Code Improvement
                </Title>
                <Box mah={1000} className='hero-box' >
                    <BackgroundImage
                        src="./hero-background.webp"
                        radius="sm"
                        w="100%"
                        h="100%"
                    >
                        <Center p="xs" h="100%" className='hero-center' >
                            <video className="hero-video" autoPlay loop muted width="100%" height="90%" >
                                <source src="/ai-improve-code.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Center>
                    </BackgroundImage>
                </Box>
                <Title className="hero-section__title" mt="30px">
                    Real-Time Code Collaboration in DevMate
                </Title>
                <Box mah={1000} className='hero-box' >
                    <BackgroundImage
                        src="./hero-background.webp"
                        radius="sm"
                        w="100%"
                        h="100%"
                    >
                        <Center p="xs" h="100%" className='hero-center' >
                            <video className="hero-video" autoPlay loop muted width="100%" height="90%" >
                                <source src="/code-collabration.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Center>
                    </BackgroundImage>
                </Box>
                <Box mah={1000} className='hero-box' >
                    <Title className="hero-section__title" mt="30px">
                        And So many more cool features...
                    </Title>
                    <Center h="100%" className='hero-center' >
                        <Text c="dimmed" mt="md">
                            Just sign in with your GitHub account and get started.
                        </Text>
                    </Center>
                </Box>
            </Flex>
        </div>
    );
}

export default HeroSection;
