"use client";
import type { RootState } from "@devmate/store/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { findFileOrFolderById, findFileOrFolderByPath } from "@devmate/app/utils/commonFunctions";
import { useParams } from "next/navigation";
import "@devmate/app/(privateroutes)/live-preview/livepreview.scss"
import { has } from "lodash";

const LivePreview = () => {
    const query = useParams();
    console.log("🚀 ~ LivePreview ~ query:", query)
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fileTreeData = useSelector((state: RootState) => state.app.fileTreeData);
    const [currentHTMLFile, setCurrentHTMLFile] = useState<FileItemDTO | null>()

    useEffect(() => {
        if (has(query, "fileid") && typeof query.fileid === 'string' && fileTreeData) {
            const htmlFile = findFileOrFolderById(fileTreeData, query.fileid)
            setCurrentHTMLFile(htmlFile as FileItemDTO);
        }
    }, [query, fileTreeData])

    useEffect(() => {
        if (!iframeRef.current || !currentHTMLFile) return;
        console.log("🚀 ~ useEffect ~ currentHTMLFile:", currentHTMLFile)

        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // Write the HTML as is, no modification
        doc.open();
        doc.write(currentHTMLFile.content ?? "");
        doc.close();
        // Find all <link> and <script> tags in the user's HTML
        const linkTags = doc.querySelectorAll("link[rel='stylesheet']");
        const scriptTags = doc.querySelectorAll("script[src]");

        // Inject CSS from Redux store
        linkTags.forEach((link) => {
            let href = link.getAttribute("href");
            console.log("🚀 ~ linkTags.forEach ~ href:", href, fileTreeData)
            if (!href) return;
            if (!fileTreeData) return;

            // Normalize the path by removing './' if it exists
            href = href.replace(/^\.\/?/, "");

            // Find the file in Redux store
            const cssFile = findFileOrFolderByPath(fileTreeData, href)
            console.log("🚀 ~ linkTags.forEach ~ cssFile:", cssFile)
            if (cssFile && cssFile.type === "file") {
                const styleTag = doc.createElement("style");
                styleTag.innerHTML = cssFile.content;
                doc.head.appendChild(styleTag);
                link.remove(); // Remove the original <link> to prevent 404 errors
            }
        });

        // Inject JS from Redux store
        scriptTags.forEach((script) => {
            let src = script.getAttribute("src");
            if (!src) return;
            if (!fileTreeData) return;

            // Normalize the path by removing './' if it exists
            src = src.replace(/^\.\/?/, "")

            // Find the file in Redux store
            const jsFile = findFileOrFolderByPath(fileTreeData, src)
            console.log("🚀 ~ scriptTags.forEach ~ jsFile:", jsFile)
            if (jsFile && jsFile.type === "file") {
                console.log("🚀 ~ scriptTags.forEach ~ jsFile:", jsFile)
                const scriptTag = doc.createElement("script");
                scriptTag.innerHTML = jsFile.content;
                scriptTag.defer = true;
                doc.body.appendChild(scriptTag);
                script.remove(); // Remove the original <script> to prevent 404 errors
            }
        });

        console.log("🚀 ~ linkTags.forEach ~ doc:", doc)


    }, [currentHTMLFile, fileTreeData]);


    return (
        <iframe
            ref={iframeRef}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            className="live-preview-frame"
        />
    );
};

export default LivePreview;
