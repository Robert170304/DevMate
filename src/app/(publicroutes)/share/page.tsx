"use client";
import EditorComponent from '@devmate/components/EditorComponent/EditorComponent'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const CodePreview = () => {
    const searchParams = useSearchParams();
    const encodedCode = searchParams.get("code") ?? "";
    const encodedLang = searchParams.get("lang") ?? "plaintext";

    try {
        const code = decodeURIComponent(atob(decodeURIComponent(encodedCode)));

        return (
            <EditorComponent
                content={code}
                language={decodeURIComponent(encodedLang)}
                onContentChange={() => { }}
                readOnly
            />
        );
    } catch {
        return <p>Invalid or corrupted shared link.</p>;
    }
};

export default CodePreview;
