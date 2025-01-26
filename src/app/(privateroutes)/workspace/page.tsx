"use client";
import EditorView from '@devmate/components/EditorView/EditorView';
import Explorer from '@devmate/components/Explorer/Explorer';
import { Box } from '@mantine/core';
import React from 'react';
import "./workspace.scss";
const Workspace = () => {
    return (
        <Box className="workspace-container">
            <Box className="explorer">
                <Explorer />
            </Box>
            <Box className="editor-view">
                <EditorView />
            </Box>
        </Box>
    );
};

export default Workspace;
