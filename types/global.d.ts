export { }; // Ensure this file is treated as a module

declare global {
    interface OutputProps {
        stdout?: string;
        stderr?: string;
    }
    interface MTNotificationProps {
        id?: string;
        title?: string;
        message?: string;
        position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
        withCloseButton?: boolean;
        onClose?: () => void;
        onOpen?: () => void;
        autoClose?: number | boolean;
        color?: string;
        className?: string;
        style?: React.CSSProperties;
        loading?: boolean;
    }
    interface ExplorerFileGroupDTO {
        id: string;
        type: string;
        name: string;
        children?: ExplorerFileGroupDTO[];
        content?: string;
        path: string;
        parentId: string;
    }

    type ExplorerItem =
        { id: string; name: string; type: 'file'; content: string | undefined; path: string; parentId: string; }
        | { id: string; name: string; type: 'folder'; children: ExplorerItem[]; path: string; parentId: string; };

    type FolderItemDTO = { id: string; name: string; children: ExplorerItem[]; path: string; parentId: string; };

    type FileItemDTO = { id: string; name: string; content: string | undefined; path: string; parentId: string; }

    interface UserResponseDTO {
        id: string;
        email: string;
        name: string;
        image: string;
    }

    interface SessionResponse {
        user: UserResponseDTO;
        accessToken: string;
        expires: string;
    }

    interface RunCodeResponse {
        success: boolean;
        error?: string;
        output: { stderr: string, stdout: string }
    }

    interface AIChatBoxDTO {
        open: boolean,
        isExplainCode: boolean,
        isModifyCode: boolean,
        modifyCodeContent: string,
        explainCodeContent: string,
        messages: {
            id: string;
            user: string;
            text: string;
            isCode?: boolean;
            isGenerating?: boolean
        }[]
    }

    interface AIAutoCompleteResponse {
        suggestions: string[]
    }

    interface SignInResponse {
        message: string;
        token?: string;
        user?: UserResponseDTO;
    };
    interface SignUpResponse {
        success?: boolean;
        message: string;
        token?: string;
        user?: UserResponseDTO;
    };
    interface DecodedToken {
        userId: string;
        iat: number;
        exp: number;
    }
    interface SignOutResponse {
        message: string;
        cleanupCount: number;
        error?: string;
    }
    interface NotifyOptions {
        id?: string;
        icon?: string;
        duration?: number;
        ariaProps?: object;
        className?: string;
        style?: object;
        position?: string;
        iconTheme?: object;
        type?: 'success' | 'error' | 'info'; // Add the type property here
    }

    interface VerifyUserResponse {
        message: string;
        tokenExpired?: boolean;
        isVerified?: boolean;
    }

    interface Window {
        responsiveVoice: {
            resume(): unknown;
            pause(): unknown;
            speak: (text: string, voice: string, options: {
                pitch: number,
                rate: number,
                volume: number,
                onstart: () => void,
                onend: () => void
            }) => void;
        };
    }

}
