import React from 'react';
import { Breadcrumbs, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import "./FilePathBreadCrumb.scss";
import FileIcon from '../FileIcon/FileIcon';

const FilePathBreadCrumb = () => {
    const currentFileData = useSelector((state: RootState) => state.app.currentFileData);

    // Split the file path into parts
    const pathParts = currentFileData?.path?.split('/') || [];

    // Map each part into a breadcrumb item
    const breadcrumbItems = pathParts.map((part, index) => {
        // Create a unique key and display the part
        return (
            <Text key={part} className="breadcrumb-item">
                {index === pathParts.length - 1 && <FileIcon name={part} />}
                {part}
            </Text>
        );
    });

    return (
        <Breadcrumbs
            separator={<IconChevronRight size={15} />}
            separatorMargin="md"
            p="5px"
            className="file-path-breadcrumb"
        >
            {breadcrumbItems}
        </Breadcrumbs>
    );
};

export default FilePathBreadCrumb;
