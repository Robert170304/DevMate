import { HYDRATE } from "next-redux-wrapper";
import actions from "./actions";
import { explorerData } from "@devmate/app/utils/utility";

const initialState: State = {
  currentFileData: { name: '', path: '', content: undefined, id: '' },
  allOpenFiles: [],
  fileTreeData: explorerData,
};

interface State {
  currentFileData: { name: string, path: string, content: string | undefined, id: string };
  allOpenFiles: { name: string, path: string, content: string | undefined, id: string }[];
  fileTreeData?: ExplorerItem[];
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
        currentFileData: (action.data as { name: string, path: string, content: string | undefined, id: string }) || {}, // Ensure compatibility with State
      };
    case actions.SET_ALL_OPEN_FILES:
      return {
        ...state,
        allOpenFiles: (action.data as { name: string, path: string, content: string | undefined, id: string }[]) || {}, // Ensure compatibility with State
      };
    case actions.SET_FILE_TREE_DATA:
      return {
        ...state,
        fileTreeData: (action.data as ExplorerItem[]) || {}, // Ensure compatibility with State
      };

    default:
      return state;
  }
};

export default appReducer;
