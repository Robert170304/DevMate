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