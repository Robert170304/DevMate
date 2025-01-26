import { toast, ToastOptions } from "react-hot-toast";

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