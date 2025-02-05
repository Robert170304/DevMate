import { Box, Text } from '@mantine/core'
import React from 'react'
import "./CodeOutputPanel.scss"
import { useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';



const CodeOutputPanel = () => {
    const outputPanelContent = useSelector((state: RootState) => state.app.outputPanelContent);
    const renderOutput = (content: string | undefined) => {
        if (!content) return <></>;
        return content.split('\n').map((line, index) => (
            <React.Fragment key={line.trim() + index}> {/* Using a combination of line content and index to create a unique key */}
                {line}
                <br />
            </React.Fragment>
        ));
    };
    return (
        <Box w="100%">
            {outputPanelContent.map((log) => (
                <React.Fragment key={log.logId}>
                    {log.stdout && (
                        <Text className="logs">
                            <strong>stdout {log.file.path} :</strong>
                            {renderOutput(log.stdout)}
                        </Text>
                    )}
                    {log.stderr && (
                        <Text className="logs">
                            <strong>stderr {log.file.path} :</strong>
                            {renderOutput(log.stderr)}
                        </Text>
                    )}
                </React.Fragment>
            ))}
        </Box>
    )
}

export default CodeOutputPanel