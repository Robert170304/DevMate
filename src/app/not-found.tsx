'use client';
import { Box, Button, SimpleGrid, Text, Title } from '@mantine/core';
import './NotFound.scss'
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter()
    return (
        <Box className="notFoundRoot">
            <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                <div>
                    <Title className="title">Something is not right...</Title>
                    <Text c="dimmed" size="lg">
                        Page you are trying to open does not exist. You may have mistyped the address, or the
                        page has been moved to another URL.
                    </Text>
                    <Button onClick={() => router.push("/")} variant="outline" size="md" mt="xl" className="control">
                        Get back to home page
                    </Button>
                </div>
            </SimpleGrid>
        </Box>
    );
}