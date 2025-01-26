const appActions = {
  SET_CURRENT_FILE_DATA: "SET_CURRENT_FILE_DATA",
  SET_ALL_OPEN_FILES: "SET_ALL_OPEN_FILES",
  SET_FILE_TREE_DATA: "SET_FILE_TREE_DATA",

  setCurrentFileData: (data: { name: string, path: string, content: string | undefined, id: string }) => ({
    type: appActions.SET_CURRENT_FILE_DATA,
    data,
  }),
  setAllOpenFiles: (data: { name: string, path: string, content: string | undefined, id: string }[]) => ({
    type: appActions.SET_ALL_OPEN_FILES,
    data,
  }),
  setFileTreeData: (data: ExplorerItem[]) => ({
    type: appActions.SET_FILE_TREE_DATA,
    data,
  }),
};

export default appActions;
