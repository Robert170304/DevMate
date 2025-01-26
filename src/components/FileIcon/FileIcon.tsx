import React, { JSX } from "react";
import {
    SiJavascript,
    SiTypescript,
    SiReact,
    SiVuedotjs,
    SiAngular,
    SiPython,
    SiPhp,
    SiGo,
    SiRuby,
    SiSwift,
    SiKotlin,
    SiHtml5,
    SiCss3,
    SiSass,
    SiMarkdown,
    SiJson,
    SiYaml,
    SiDocker,
    SiNodedotjs,
    SiPostgresql,
    SiMysql,
    SiMongodb,
    SiFirebase,
    SiGraphql,
    SiCplusplusbuilder,
} from "react-icons/si";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaJava, FaImage, FaVideo } from "react-icons/fa";
import { VscFileCode, VscFileZip, VscFile } from "react-icons/vsc";
import { TbBrandCSharp } from "react-icons/tb";
import { GiDirectionSigns } from "react-icons/gi";

interface FileIconProps {
    name: string;
}

const FileIcon = ({ name }: FileIconProps) => {
    const extension = name.split(".").slice(-2).join(".").toLowerCase(); // For sub-extensions
    const fallbackExtension = name.split(".").pop()?.toLowerCase() ?? ""; // For single extensions

    const extensionMap: { [key: string]: JSX.Element } = {
        // file name specific icons
        "router.ts": <GiDirectionSigns color="#239120" size={19} />,

        // Angular-specific sub-extensions
        "component.ts": <SiAngular color="#3178C6" size={16} />,
        "service.ts": <SiAngular color="#F7DF1E" size={16} />,
        "module.ts": <SiAngular color="#DD0031" size={16} />,
        "routing.ts": <GiDirectionSigns color="#239120" size={19} />,
        "component.css": <SiCss3 color="#1572B6" size={16} />,
        "component.scss": <SiSass color="#CC6699" size={16} />,

        // Programming Languages
        js: <SiJavascript color="#F7DF1E" size={16} />,
        jsx: <SiReact color="#61DAFB" size={16} />,
        ts: <SiTypescript color="#3178C6" size={16} />,
        tsx: <SiReact color="#61DAFB" size={16} />,
        py: <SiPython color="#3776AB" size={16} />,
        java: <FaJava color="#f89820" size={16} />,
        php: <SiPhp color="#777BB4" size={19} />,
        go: <SiGo color="#00ADD8" size={19} />,
        rb: <SiRuby color="#CC342D" size={14} />,
        swift: <SiSwift color="#FA7343" size={16} />,
        kt: <SiKotlin color="#0095D5" size={16} />,
        cs: <TbBrandCSharp color="#239120" size={16} />,
        cpp: <SiCplusplusbuilder color="#00599C" size={16} />,
        html: <SiHtml5 color="#E34F26" size={16} />,
        css: <SiCss3 color="#1572B6" size={16} />,
        scss: <SiSass color="#CC6699" size={16} />,
        json: <SiJson color="#E44D26" size={16} />,
        yaml: <SiYaml color="#CB171E" size={16} />,
        md: <SiMarkdown color="#1971c2" size={16} />,

        // Frameworks and Tools
        vue: <SiVuedotjs color="#4FC08D" size={16} />,
        angular: <SiAngular color="#DD0031" size={16} />,
        node: <SiNodedotjs color="#339933" size={16} />,
        docker: <SiDocker color="#2496ED" size={16} />,
        graphql: <SiGraphql color="#E10098" size={16} />,
        firebase: <SiFirebase color="#FFCA28" size={16} />,

        // Databases
        sql: <SiMysql color="#4479A1" size={16} />,
        db: <SiPostgresql color="#336791" size={16} />,
        mongo: <SiMongodb color="#47A248" size={16} />,

        // Documents
        pdf: <FaFilePdf color="#E34F26" size={16} />,
        doc: <FaFileWord color="#2A579A" size={16} />,
        docx: <FaFileWord color="#2A579A" size={16} />,
        xls: <FaFileExcel color="#207245" size={16} />,
        xlsx: <FaFileExcel color="#207245" size={16} />,
        ppt: <FaFilePowerpoint color="#D24726" size={16} />,
        pptx: <FaFilePowerpoint color="#D24726" size={16} />,

        // Compressed Files
        zip: <VscFileZip color="#8E8E8E" size={16} />,
        rar: <VscFileZip color="#8E8E8E" size={16} />,
        tar: <VscFileZip color="#8E8E8E" size={16} />,
        gz: <VscFileZip color="#8E8E8E" size={16} />,

        // Media
        png: <FaImage color="#FFCA28" size={16} />,
        gif: <FaImage color="#FFCA28" size={16} />,
        tiff: <FaImage color="#FFCA28" size={16} />,
        svg: <FaImage color="#FFCA28" size={16} />,
        jpeg: <FaImage color="#FFCA28" size={16} />,
        jpg: <FaImage color="#FFCA28" size={16} />,
        webp: <FaImage color="#FFCA28" size={16} />,
        mp4: <FaVideo color="#FFCA28" size={16} />,
        mov: <FaVideo color="#FFCA28" size={16} />,
        wmv: <FaVideo color="#FFCA28" size={16} />,
        avi: <FaVideo color="#FFCA28" size={16} />,
        flv: <FaVideo color="#FFCA28" size={16} />,
        mkv: <FaVideo color="#FFCA28" size={16} />,

        // Default Fallback for Code Files
        code: <VscFileCode size={16} />,

        // Fallback for Any Other File
        default: <VscFile size={16} />,
    };

    return extensionMap[extension] || extensionMap[fallbackExtension] || extensionMap[name] || extensionMap.default;
};

export default FileIcon;
