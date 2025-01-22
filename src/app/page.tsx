"use client";

import HeroSection from "@devmate/components/HeroSection/HeroSection";
import { Center } from "@mantine/core";
import { Suspense } from "react";

export default function Home() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Center p="lg" w="100%" h="100%">
        <HeroSection />
      </Center>
    </Suspense>
  );
}
