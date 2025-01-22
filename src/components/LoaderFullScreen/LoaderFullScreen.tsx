// components/ui/FullScreenLoader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Flex, Image } from '@mantine/core';
import "./LoaderFullScreen.scss";

const FullScreenLoader = () => {
    return (
        <Flex
            className='loaderContainer'
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100px',
                    height: '100px',
                }}
            >
                <Image src="/app-icon-non-bg.svg" alt='logo' width="100%" height="100%" />
            </motion.div>
        </Flex>
    );
};

export default FullScreenLoader;
