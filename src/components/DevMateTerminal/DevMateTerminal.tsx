import { ActionIcon, Box, Tabs, Tooltip } from '@mantine/core'
import React from 'react'
import "./DevMateTerminal.scss"
import { IconTrashXFilled, IconX } from '@tabler/icons-react'
import appActions from '@devmate/store/app/actions';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import { useContextMenu } from 'react-contexify';
import ContextMenu from '../ContextMenu/ContextMenu';
import CommandPanel from '../CommandPanel/CommandPanel';
import CodeOutputPanel from '../CodeOutputPanel/CodeOutputPanel';

const MENU_ID = 'terminal_context_menu';

const { setIsTerminalOpen, setOutputPanelContent } = appActions;

const DevMateTerminal = () => {
    const outputPanelContent = useSelector((state: RootState) => state.app.outputPanelContent);
    const terminalContextMenuItems = [
        {
            id: 'copy',
            label: 'Copy',
            action: () => {
                handleCopyLogs()
            }
        },
        {
            id: 'clear',
            label: 'Clear',
            action: () => {
                dispatch(setOutputPanelContent([]));
            }
        },
        {
            id: 'kill_terminal',
            label: 'Kill Panel',
            action: () => {
                dispatch(setOutputPanelContent([]));
                dispatch(setIsTerminalOpen(false))
            }
        },
    ]
    const dispatch = useDispatch();
    const { show } = useContextMenu({
        id: MENU_ID,
    });

    function handleContextMenu(event: React.MouseEvent) {
        console.log("🚀 ~ handleContextMenu ~ event:", event)
        show({
            event,
        })
    }

    const handleCopyLogs = () => {
        const content = outputPanelContent
            .map((entry) =>
                `Log ${entry.logId}:\n` +
                `stdout: ${entry.stdout || ''}\n` +
                `stderr: ${entry.stderr || ''}\n` +
                `File: ${entry.file.path}\n` +
                `------------------------------------`
            )
            .join("\n");

        navigator.clipboard.writeText(content)
            .then(() => {
                console.log('Logs copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy logs: ', err);
            });
    };


    return (
        <Box w="100%" onContextMenu={handleContextMenu}>

            <Box className='terminal-section-content' >
                <Tabs color="teal" defaultValue="output-panel">
                    <Tabs.List>
                        {/* <Tabs.Tab value="terminal-panel">Terminal</Tabs.Tab> */}
                        <Tabs.Tab value="output-panel" color="blue">
                            Output
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="terminal-panel" pt="xs">
                        <CommandPanel />
                    </Tabs.Panel>

                    <Tabs.Panel value="output-panel" pt="xs">
                        <CodeOutputPanel />
                    </Tabs.Panel>
                </Tabs>
            </Box>
            <Box className='terminal_header' >
                <Box className='terminal_header__actions' >
                    <Tooltip label="Delete Terminal" withArrow>
                        <ActionIcon variant="subtle" color="gray" onClick={() => {
                            dispatch(setIsTerminalOpen(false));
                            dispatch(setOutputPanelContent([]));
                        }}  >
                            <IconTrashXFilled size={13} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Close Terminal" withArrow>
                        <ActionIcon onClick={() => dispatch(setIsTerminalOpen(false))} variant="subtle" color="gray">
                            <IconX size={13} />
                        </ActionIcon>
                    </Tooltip>
                </Box>
            </Box>
            <ContextMenu items={terminalContextMenuItems} menuId={MENU_ID} />
        </Box>
    )
}

export default DevMateTerminal