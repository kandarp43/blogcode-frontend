export const initialLoadState = null;

export const loadReducer = (loading, action) => {
  if (action.type === "LOAD") {
    return false;
  }
  if (action.type === "LOADOFF") {
    return true;
  }

  return loading;
};
