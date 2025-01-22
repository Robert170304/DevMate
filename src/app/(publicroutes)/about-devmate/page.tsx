"use client"
import React from 'react';
import { Title, Text, Group, List, ThemeIcon, Button, Box } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export default function About() {
    return (
        <Box size="md" className="about-us" mt="lg" px={20} >
            <Title order={1} className="about-us-title">
                About DevMate
            </Title>

            <Text mt="md" size="lg">
                Empowering Developers, One Collaboration at a Time
            </Text>
            <Text mt="sm">
                Welcome to <strong>DevMate</strong> — where coding meets collaboration, and creativity knows no bounds. We built DevMate with a simple mission: to provide developers with the ultimate workspace that combines AI-powered tools, seamless collaboration, and an intuitive interface.
            </Text>

            <Text mt="sm">
                Whether you’re a solo developer building your next big project or part of a dynamic team coding together in real time, <strong>DevMate</strong> gives you everything you need to write better code, faster, and smarter.
            </Text>

            <Title order={2} mt="xl">
                DevMate&apos;s Vision
            </Title>
            <Text mt="sm">
                We envision a future where technology empowers creativity and innovation is accessible to all. With AI at the heart of DevMate, we’re transforming the way developers code, collaborate, and create. We strive to make <strong>coding more efficient, fun, and collaborative</strong>, fostering a community where ideas come to life effortlessly.
            </Text>

            <Title order={2} mt="xl">
                What Makes It Different?
            </Title>
            <List
                mt={30}
                spacing="sm"
                size="sm"
                icon={
                    <ThemeIcon color="teal" size={20} radius="xl"><IconCheck size={15} /></ThemeIcon>
                }
            >
                <List.Item>
                    <strong>AI-Powered Coding Assistant:</strong> Write smarter code with our built-in AI assistant. From code generation to debugging, DevMate brings AI-enhanced tools directly into your workflow to boost productivity.
                </List.Item>
                <List.Item>
                    <strong>Real-Time Collaboration:</strong> Code with your team like never before! Collaborate on projects in real time, share ideas, and build together seamlessly — all from one platform.
                </List.Item>
                <List.Item>
                    <strong>Customizable Workspace:</strong> Tailor your development environment to match your workflow. With DevMate, flexibility and personalization go hand-in-hand.
                </List.Item>
                <List.Item>
                    <strong>Powerful Integrations:</strong> Connect with your favorite tools and platforms to manage projects, repositories, and more — all within one workspace.
                </List.Item>
            </List>

            <Title order={2} mt="xl">
                Why Choose DevMate?
            </Title>
            <Text mt="sm">
                Save hours with intelligent suggestions, connect and collaborate effortlessly, innovate with cutting-edge AI, and enjoy a platform accessible to developers of all levels.
            </Text>

            <Group mt="xl" align="center">
                <Button variant="filled" radius="xl" size="md">
                    Get Started
                </Button>
                <Button variant="outline" radius="xl" size="md">
                    Learn More
                </Button>
            </Group>
        </Box>
    );
};

