import React, { useState } from 'react';
import { Group, TextInput, Modal, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const WorkspaceHeader: React.FC = () => {
    const [searchModalOpened, setSearchModalOpened] = useState(false);

    return (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Group>
                <img src="/path-to-your-logo.png" alt="Logo" style={{ height: 40 }} />
                <h1>Workspace</h1>
            </Group>
            <Group>
                <Button variant="outline" onClick={() => setSearchModalOpened(true)}>
                    <IconSearch size={18} />
                </Button>
            </Group>

            <Modal
                opened={searchModalOpened}
                onClose={() => setSearchModalOpened(false)}
                title="Search Files"
            >
                <TextInput
                    placeholder="Search..."
                />
            </Modal>
        </header>
    );
};

export default WorkspaceHeader;