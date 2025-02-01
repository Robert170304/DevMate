import { toast, ToastOptions } from "react-hot-toast";
import { notifications } from '@mantine/notifications';

export const notify = (text: string, extraParams: ToastOptions) => {
  toast.dismiss();
  toast(text, { ...extraParams } as ToastOptions);
};

export const copyToClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    notify("Copied to clipboard.", { icon: "✅" });
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