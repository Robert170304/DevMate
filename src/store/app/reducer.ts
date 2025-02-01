import { HYDRATE } from "next-redux-wrapper";
import actions from "./actions";

const initialState: State = {
  currentFileData: { name: '', path: '', content: "", id: '', parentId: "", },
  allOpenFiles: [],
  fileTreeData: [],
  isTerminalPanelOpen: false,
  outputPanelContent: [],
};

interface State {
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
        allOpenFiles: (action.data as FileItemDTO[]) || {}, // Ensure compatibility with State
      };
    case actions.SET_FILE_TREE_DATA:
      return {
        ...state,
        fileTreeData: (action.data as ExplorerItem[]) || {}, // Ensure compatibility with State
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

    default:
      return state;
  }
};

export default appReducer;
