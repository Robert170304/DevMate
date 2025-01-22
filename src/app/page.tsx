"use client";

import HeroSection from "@devmate/components/HeroSection/HeroSection";
import { Center } from "@mantine/core";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Home() {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const showFeatures = searchParams.get("features");
    if (showFeatures === "true") {
      const element = document.getElementById("features-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.history.replaceState(null, "", "/");
    }
  }, [pathName, searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Center p="lg" w="100%" h="100%">
        <HeroSection />
      </Center>
    </Suspense>
  );
}
