import { Box, Text } from '@mantine/core'
import React, { type JSX } from 'react'
import "./CodeOutputPanel.scss"
import { useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';



const CodeOutputPanel = () => {
    const outputPanelContent = useSelector((state: RootState) => state.app.outputPanelContent);
    const renderOutput = (content: string): JSX.Element[] => {
        return content.split('\n').map((line, index) => (
            <React.Fragment key={line.trim() + index}> {/* Using a combination of line content and index to create a unique key */}
                {line}
                <br />
            </React.Fragment>
        ));
    };
    return (
        <Box w="100%" >
            {outputPanelContent.map((log) => {
                if (log.stdout) {
                    return (
                        <Text key={log.logId} className="logs">
                            <strong>stdout {log.file.path} :</strong>
                            {renderOutput(log.stdout)}
                        </Text>
                    )
                }
                if (log.stderr) {
                    return (
                        <Text key={log.logId} className="logs">
                            <strong>stderr {log.file.path} :</strong>
                            {renderOutput(log.stderr)}
                        </Text>
                    )
                }
            })}
        </Box>
    )
}

export default CodeOutputPanel