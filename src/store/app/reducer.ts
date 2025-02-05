import { HYDRATE } from "next-redux-wrapper";
import actions from "./actions";

const initialState: State = {
  userData: { id: "", email: "", name: "", image: "" },
  currentFileData: { name: '', path: '', content: "", id: '', parentId: "", },
  allOpenFiles: [],
  fileTreeData: [],
  isTerminalPanelOpen: false,
  outputPanelContent: [],
  isAIChatBoxOpen: {
    open: false, messages: [], isExplainCode: false, explainCodeContent: "", isModifyCode: false, modifyCodeContent: ""
  }
};

interface State {
  isAIChatBoxOpen: AIChatBoxDTO;
  userData: UserResponseDTO;
  currentFileData: FileItemDTO;
  allOpenFiles: FileItemDTO[];
  fileTreeData?: ExplorerItem[];
  isTerminalPanelOpen: boolean;
  outputPanelContent: { stdout: string, stderr: string, file: FileItemDTO, logId: string }[];
}

interface Action<T = unknown> {
  type: string;
  payload?: T;
  data?: T;
}
const appReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...(typeof action.payload === 'object' && action.payload !== null ? action.payload : {}) };
    case actions.SET_CURRENT_FILE_DATA:
      return {
        ...state,
        currentFileData: (action.data as FileItemDTO) || {}, // Ensure compatibility with State
      };
    case actions.SET_ALL_OPEN_FILES:
      return {
        ...state,
        allOpenFiles: (action.data as FileItemDTO[]) || [], // Ensure compatibility with State
      };
    case actions.SET_FILE_TREE_DATA:
      return {
        ...state,
        fileTreeData: (action.data as ExplorerItem[]) || [], // Ensure compatibility with State
      };
    case actions.SET_IS_TERMINAL_OPEN:
      return {
        ...state,
        isTerminalPanelOpen: action.data as boolean,
      };
    case actions.SET_OUTPUT_PANEL_CONTENT:
      return {
        ...state,
        outputPanelContent: action.data as { stdout: string, stderr: string, file: FileItemDTO, logId: string }[],
      };
    case actions.SET_USER_DATA:
      return {
        ...state,
        userData: (action.data as UserResponseDTO) || {},
      };
    case actions.SET_AICHATBOX_OPEN:
      return {
        ...state,
        isAIChatBoxOpen: action.data as AIChatBoxDTO,
      };

    default:
      return state;
  }
};

export default appReducer;
