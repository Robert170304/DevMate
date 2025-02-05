import { toast, ToastOptions } from "react-hot-toast";
import { notifications } from '@mantine/notifications';
import { has } from "lodash";
import hljs from 'highlight.js';


export const notify = (text: string, extraParams: ToastOptions) => {
  toast.dismiss();
  toast(text, { ...extraParams } as ToastOptions);
};

export const copyToClipBoard = async (text: string, shouldNotify: boolean = false) => {
  try {
    await navigator.clipboard.writeText(text);
    if (shouldNotify) {
      notify("Copied to clipboard.", { icon: "✅" });
    }
  } catch (err) {
    console.error("🚀 ~ copyToClipBoard ~ err:", err);
    notify("Failed to copy!", { icon: "❌" });
  }
};

export const findFileOrFolderById = (data: ExplorerItem[], id: string): ExplorerItem | null => {
  for (const item of data) {
    if (item.id === id) return item;
    if (item.type === 'folder') {
      const foundInChildren = findFileOrFolderById(item.children, id);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
};

export const findFileOrFolderByPath = (data: ExplorerItem[], path: string): ExplorerItem | null => {
  for (const item of data) {
    if (item.path === path) return item;
    if (item.type === 'folder') {
      const foundInChildren = findFileOrFolderByPath(item.children, path);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
};

export const findFileOrFolderByNameInFolder = (
  data: ExplorerItem[],
  parentId: string,
  fileName: string
): ExplorerItem | null => {

  // If folderId is null, search in the root level
  if (parentId === "root") {
    for (const item of data) {
      if (item.name === fileName) {
        return item; // Found the file at the root level
      }
    }
    return null; // File not found in root or any subfolder
  }

  // Otherwise, find the folder by its id
  const folder = data.find(item => item.id === parentId && item.type === 'folder');

  if (!folder || !has(folder, "children")) return null; // If folder not found, return null

  // Search within the folder's children (this is the recursive part)
  for (const item of folder.children as ExplorerItem[]) {
    if (item.name === fileName) {
      return item; // Found the file in this folder
    }
    // If the item is a folder, search recursively inside it
    if (item.type === 'folder') {
      const foundInChildren = findFileOrFolderByNameInFolder(item.children, parentId, fileName);
      if (foundInChildren) return foundInChildren; // Return if found in subfolder
    }
  }

  return null; // If the file is not found in this folder or its subfolders
};



export const showNotification = (props: MTNotificationProps) => {
  const {
    id,
    title,
    message,
    position,
    withCloseButton,
    onClose,
    onOpen,
    autoClose,
    color,
    className,
    style,
    loading,
  } = props;
  notifications.show({
    id: id ?? Math.random().toString(),
    title: title ?? "Notification",
    message: message ?? "Notification message",
    position: position ?? "top-right",
    withCloseButton: withCloseButton ?? true,
    onClose: onClose ?? (() => { }),
    onOpen: onOpen ?? (() => { }),
    autoClose: autoClose ?? 5000,
    color: color ?? "blue",
    className: className ?? undefined,
    style: style || {},
    loading: loading || false,
  });
};


export const getFileDefaultContent = (extension: string) => {
  console.log("🚀 ~ getFileDefaultContent ~ extension:", extension)
  switch (extension) {
    case "js":
      return `console.log("Hello, World!")`;
    case "ts":
      return `console.log("Hello, World!")`;
    case "jsx":
      return `console.log("Hello, World!")`;
    case "tsx":
      return `console.log("Hello, World!")`;
    case "html":
      return `<!DOCTYPE html>`;
    case "css":
      return `body { margin: 0; }`;
    case "json":
      return `{}`;
    case "md":
      return `# Markdown`;
    case "py":
      return `print("Hello, World!")`;
    case "java":
      return `
// ⚠️ IMPORTANT: Do NOT delete or rename the 'Temp' class!
// This class is required for running Java code in this environment.
public class Temp {
    public static void main(String[] args) {
        new Object() {
            void run() {
                System.out.println("Hello, Java World!");
            }
        }.run();
    }
}`;
    default:
      return `// Start coding here...`;
  }
}

export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() ?? '' : '';
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper function to collect all IDs of files inside a deleted folder
export const collectFileIds = (data: ExplorerItem[], folderId: string): string[] => {
  let ids: string[] = [];

  for (const item of data) {
    if (item.id === folderId) {
      // Collect IDs of all nested files
      const getIds = (folder: ExplorerItem): string[] => {
        let nestedIds: string[] = [folder.id]; // Include the folder itself
        if (folder.type === "folder") {
          folder.children.forEach((child) => {
            nestedIds = [...nestedIds, ...getIds(child)];
          });
        }
        return nestedIds;
      };

      ids = getIds(item);
      break;
    } else if (item.type === "folder") {
      ids = [...ids, ...collectFileIds(item.children, folderId)];
    }
  }
  return ids;
};

export const extractCodeLines = (suggestionsArray: string[]): string[] => {
  const fullText = suggestionsArray.join("\n");
  const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/i;
  const match = codeBlockRegex.exec(fullText);

  if (match?.[2]) {
    const language = match[1].toLowerCase(); // e.g., "python", "javascript"
    let codeLines = match[2].split("\n").map(line => line.trim());

    // Define patterns for different languages
    const commentPatterns: Record<string, RegExp> = {
      python: /^#/, // Remove lines starting with #
      javascript: /^(\/\/|\/\*|\*\/)/, // Remove JS single-line and block comments
      typescript: /^(\/\/|\/\*|\*\/)/,
      java: /^(\/\/|\/\*|\*\/)/,
      c: /^(\/\/|\/\*|\*\/)/,
      cpp: /^(\/\/|\/\*|\*\/)/,
      swift: /^\/\//,
      ruby: /^#/,
      php: /^(\/\/|\/\*|\*\/)/,
      go: /^(\/\/|\/\*|\*\/)/,
    };

    const printPatterns: Record<string, RegExp> = {
      python: /^print/,
      javascript: /console\.log/,
      typescript: /console\.log/,
      java: /System\.out\.println/,
      c: /printf/,
      cpp: /cout/,
      swift: /print/,
      ruby: /puts/,
      php: /echo|print/,
      go: /fmt\.Print/,
    };

    // Remove comments
    if (commentPatterns[language]) {
      codeLines = codeLines.filter(line => !commentPatterns[language].test(line));
    }

    // Remove print/logging statements
    if (printPatterns[language]) {
      codeLines = codeLines.filter(line => !printPatterns[language].test(line));
    }

    return codeLines;
  }

  return [];
};


export const generateMessageId = () => {
  return `${Date.now()}-${Math.random()}`
}

// export const detectCode = (text: string) => /```[\s\S]+?```/.test(text); // Detects code blocks

export const detectCode = (text: string) => {
  // Check for either code block using backticks or Python-specific patterns like 'def', 'import', etc.
  const regex = /```[\s\S]+```|([^\n]+\n){2,}[ \t]+[^\n]+/;
  return regex.test(text);
};


const autoDetectLanguage = (code: string): string => {
  const result = hljs.highlightAuto(code);
  return result.language ?? 'plaintext';
};

export const preprocessMDContent = (content: string): string => {
  // If content already contains markdown code blocks, leave it untouched.
  if (content.includes("```")) return content;

  // Split into lines to check if it's multi-line.
  const lines = content.split("\n");
  if (lines.length < 2) return content;

  // Use our auto-detection function.
  const detectedLang = autoDetectLanguage(content);

  // Wrap the content in a code block with the detected language.
  return `\`\`\`${detectedLang}\n${content}\n\`\`\``;
};
