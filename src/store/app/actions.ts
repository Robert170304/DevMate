const appActions = {
  SET_USER_DATA: "SET_USER_DATA",
  SET_CURRENT_FILE_DATA: "SET_CURRENT_FILE_DATA",
  SET_ALL_OPEN_FILES: "SET_ALL_OPEN_FILES",
  SET_FILE_TREE_DATA: "SET_FILE_TREE_DATA",
  SET_IS_TERMINAL_OPEN: "SET_IS_TERMINAL_OPEN",
  SET_OUTPUT_PANEL_CONTENT: "SET_OUTPUT_PANEL_CONTENT",
  SET_AICHATBOX_OPEN: "SET_AICHATBOX_OPEN",
  SET_ACTIVE_COLLAB_SESSION: "SET_ACTIVE_COLLAB_SESSION",
  SET_SOCKET_DATA: "SET_SOCKET_DATA",

  setSocketData: (data: SocketDataDTO) => ({
    type: appActions.SET_SOCKET_DATA,
    data,
  }),
  setActiveCollabSession: (data: ActiveCollabSessionDTO) => ({
    type: appActions.SET_ACTIVE_COLLAB_SESSION,
    data,
  }),
  setIsAIChatBox: (data: AIChatBoxDTO) => ({
    type: appActions.SET_AICHATBOX_OPEN,
    data,
  }),
  setUserData: (data: UserResponseDTO) => ({
    type: appActions.SET_USER_DATA,
    data,
  }),
  setCurrentFileData: (data: FileItemDTO) => ({
    type: appActions.SET_CURRENT_FILE_DATA,
    data,
  }),
  setAllOpenFiles: (data: FileItemDTO[]) => ({
    type: appActions.SET_ALL_OPEN_FILES,
    data,
  }),
  setFileTreeData: (data: ExplorerItem[]) => ({
    type: appActions.SET_FILE_TREE_DATA,
    data,
  }),
  setIsTerminalOpen: (data: boolean) => ({
    type: appActions.SET_IS_TERMINAL_OPEN,
    data,
  }),
  setOutputPanelContent: (data: { stdout: string, stderr: string, file: FileItemDTO, logId: string }[]) => ({
    type: appActions.SET_OUTPUT_PANEL_CONTENT,
    data,
  }),
};

export default appActions;
