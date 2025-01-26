export { }; // Ensure this file is treated as a module

declare global {
    interface ExplorerFileGroupDTO {
        id: string;
        type: string;
        name: string;
        children?: ExplorerFileGroupDTO[];
        content?: string;
    }

    type ExplorerItem =
        | { id: string; name: string; type: 'file'; content: string; }
        | { id: string; name: string; type: 'folder'; children: ExplorerItem[]; };

    interface SavedDraft {
        id?: number;
        title: string;
        subtitle: string;
        content: string;
        createdAt: string;
    }

    interface UserResponseDTO {
        id: string;
        email: string;
        verifiedEmail?: boolean;
        firstName: string;
        lastName: string;
        name: string;
        image: string;
    }
    interface oauth2userinfo {
        id?: string;
        email?: string;
        isEmailVerified?: boolean;
        fullName?: string;
        firstName?: string;
        lastName?: string;
        image?: string;
        signInType?: string;
    }

    interface SaveDraftResponse {
        message: string;
        draft?: {
            id: number;
            title: string;
            subtitle?: string;
            content: string;
            userId: string;
            createdAt: string;
        };
    };
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
    interface GoogleSignInResponse {
        message: string;
        token?: string;
        user?: {
            id: string;
            email: string;
            verified_email?: boolean;
            given_name: string;
            family_name: string;
            name: string;
            image: string;
        };
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

    interface GetSavedDraftsResponse {
        message: string;
        drafts?: SavedDraft[];
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
