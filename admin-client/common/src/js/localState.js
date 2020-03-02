export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('admin');
    if (serializedState === null) {
      return undefined;
    }

    return {admin: JSON.parse(serializedState)};
  }
  catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.admin);
    localStorage.setItem('admin', serializedState);
  }
  catch (err) {
    //
  }
};
