"use client";
import EditorView from '@devmate/components/EditorView/EditorView';
import Explorer from '@devmate/components/Explorer/Explorer';
import { Box } from '@mantine/core';
import React from 'react';
import "./workspace.scss";
import { useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import DevMateTerminal from '@devmate/components/DevMateTerminal/DevMateTerminal';
const Workspace = () => {
    const isTerminalPanelOpen = useSelector((state: RootState) => state.app.isTerminalPanelOpen);
    console.log("🚀 ~ Workspace ~ isTerminalPanelOpen:", isTerminalPanelOpen)
    return (
        <Box className="workspace-container">
            <Box className="explorer">
                <Explorer />
            </Box>
            <Box className="editor-view">
                <EditorView />
            </Box>
            {isTerminalPanelOpen && <Box className="terminal-section">
                <DevMateTerminal />
            </Box>}
        </Box>
    );
};

export default Workspace;
