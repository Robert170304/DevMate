"use client";
import {
    Badge,
    Box,
    Card,
    Group,
    SimpleGrid,
    Text,
    Title,
} from '@mantine/core';
import './FeatureCards.scss'
import { featuresData } from '@devmate/app/utils/utility';

const FeatureCards: React.FC = () => {
    const features = featuresData.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" className="featureCard" padding="xl">
            <feature.icon size={50} stroke={2} color="#e66c2c" />
            <Text fz="lg" fw={500} className="featureCardTitle" mt="md">
                {feature.title}
            </Text>
            <Text fz="sm" c="dimmed" mt="sm">
                {feature.description}
            </Text>
        </Card>
    ));

    return (
        <Box size="lg" py="xl" id='features-section' >
            <Group justify="center">
                <Badge className="featureSectionBadge" variant="filled" size="lg">
                    Code with rich features
                </Badge>
            </Group>

            <Title className="featuresSectionTitle" ta="center" mt="sm">
                Enhance Your Coding with DevMate
            </Title>

            <Text c="dimmed" className="featuresSectionDescription" ta="center" mt="md">
                DevMate offers a suite of powerful tools to streamline your development process, from AI assistance to real-time collaboration and seamless version control.
            </Text>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
                {features}
            </SimpleGrid>
        </Box>
    );
}

export default FeatureCards
