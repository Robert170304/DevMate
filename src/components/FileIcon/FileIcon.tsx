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
    SiRust,
    SiC,
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
        "component.ts": <SiAngular color="#3178C6" size={12} />,
        "service.ts": <SiAngular color="#F7DF1E" size={12} />,
        "module.ts": <SiAngular color="#DD0031" size={12} />,
        "routing.ts": <GiDirectionSigns color="#239120" size={19} />,
        "component.css": <SiCss3 color="#1572B6" size={12} />,
        "component.scss": <SiSass color="#CC6699" size={12} />,

        // Programming Languages
        js: <SiJavascript color="#F7DF1E" size={12} />,
        jsx: <SiReact color="#61DAFB" size={12} />,
        ts: <SiTypescript color="#3178C6" size={12} />,
        tsx: <SiReact color="#61DAFB" size={12} />,
        py: <SiPython color="#3776AB" size={12} />,
        java: <FaJava color="#f89820" size={12} />,
        php: <SiPhp color="#777BB4" size={19} />,
        go: <SiGo color="#00ADD8" size={19} />,
        rb: <SiRuby color="#CC342D" size={12} />,
        rs: <SiRust color="#CC342D" size={12} />,
        swift: <SiSwift color="#FA7343" size={12} />,
        kt: <SiKotlin color="#0095D5" size={12} />,
        c: <SiC color="#239120" size={12} />,
        cs: <TbBrandCSharp color="#239120" size={12} />,
        csx: <TbBrandCSharp color="#239120" size={12} />,
        cpp: <SiCplusplusbuilder color="#00599C" size={12} />,
        html: <SiHtml5 color="#E34F26" size={12} />,
        css: <SiCss3 color="#1572B6" size={12} />,
        scss: <SiSass color="#CC6699" size={12} />,
        json: <SiJson color="#E44D26" size={12} />,
        yaml: <SiYaml color="#CB171E" size={12} />,
        md: <SiMarkdown color="#1971c2" size={12} />,

        // Frameworks and Tools
        vue: <SiVuedotjs color="#4FC08D" size={12} />,
        angular: <SiAngular color="#DD0031" size={12} />,
        node: <SiNodedotjs color="#339933" size={12} />,
        docker: <SiDocker color="#2496ED" size={12} />,
        graphql: <SiGraphql color="#E10098" size={12} />,
        firebase: <SiFirebase color="#FFCA28" size={12} />,

        // Databases
        sql: <SiMysql color="#4479A1" size={12} />,
        db: <SiPostgresql color="#336791" size={12} />,
        mongo: <SiMongodb color="#47A248" size={12} />,

        // Documents
        pdf: <FaFilePdf color="#E34F26" size={12} />,
        doc: <FaFileWord color="#2A579A" size={12} />,
        docx: <FaFileWord color="#2A579A" size={12} />,
        xls: <FaFileExcel color="#207245" size={12} />,
        xlsx: <FaFileExcel color="#207245" size={12} />,
        ppt: <FaFilePowerpoint color="#D24726" size={12} />,
        pptx: <FaFilePowerpoint color="#D24726" size={12} />,

        // Compressed Files
        zip: <VscFileZip color="#8E8E8E" size={12} />,
        rar: <VscFileZip color="#8E8E8E" size={12} />,
        tar: <VscFileZip color="#8E8E8E" size={12} />,
        gz: <VscFileZip color="#8E8E8E" size={12} />,

        // Media
        png: <FaImage color="#FFCA28" size={12} />,
        gif: <FaImage color="#FFCA28" size={12} />,
        tiff: <FaImage color="#FFCA28" size={12} />,
        svg: <FaImage color="#FFCA28" size={12} />,
        jpeg: <FaImage color="#FFCA28" size={12} />,
        jpg: <FaImage color="#FFCA28" size={12} />,
        webp: <FaImage color="#FFCA28" size={12} />,
        mp4: <FaVideo color="#FFCA28" size={12} />,
        mov: <FaVideo color="#FFCA28" size={12} />,
        wmv: <FaVideo color="#FFCA28" size={12} />,
        avi: <FaVideo color="#FFCA28" size={12} />,
        flv: <FaVideo color="#FFCA28" size={12} />,
        mkv: <FaVideo color="#FFCA28" size={12} />,

        // Default Fallback for Code Files
        code: <VscFileCode size={12} />,

        // Fallback for Any Other File
        default: <VscFile size={12} />,
    };

    return extensionMap[extension] || extensionMap[fallbackExtension] || extensionMap[name] || extensionMap.default;
};

export default FileIcon;
