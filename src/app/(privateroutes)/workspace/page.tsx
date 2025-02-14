"use client";
import EditorView from '@devmate/components/EditorView/EditorView';
import Explorer from '@devmate/components/Explorer/Explorer';
import { Box } from '@mantine/core';
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import DevMateTerminal from '@devmate/components/DevMateTerminal/DevMateTerminal';
import AIChatBox from '@devmate/components/AIChatBox/AIChatBox';
import WorkspaceFooter from '@devmate/components/WorkspaceFooter/WorkspaceFooter';
import "@devmate/app/(privateroutes)/workspace/workspace.scss"


const Workspace = () => {
    const isTerminalPanelOpen = useSelector((state: RootState) => state.app.isTerminalPanelOpen);
    const isAIChatBox = useSelector((state: RootState) => state.app.isAIChatBoxOpen);
    return (
        <Box className="workspace-container">
            {/* <Box className='workspace-header' >
                <WorkspaceHeader />
            </Box> */}
            <Box className='workspace-content' >
                <Box className="explorer">
                    <Explorer />
                </Box>
                <Box className="editor-view-box">
                    <EditorView />
                </Box>
                {isAIChatBox.open && <Box className='chat_view' >
                    <AIChatBox />
                </Box>}
                {isTerminalPanelOpen && <Box className="terminal-section">
                    <DevMateTerminal />
                </Box>
                }
            </Box>
            <Box className='workspace-footer' >
                <WorkspaceFooter />
            </Box>
        </Box>
    );
};

export default Workspace;
