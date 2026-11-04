// Base Selector Node
const selectUserBaseState = (state) => state.users;

// Memoized-friendly or straight extraction selectors
export const selectAllUsers = (state) => selectUserBaseState(state).list;
export const selectUsersLoading = (state) => selectUserBaseState(state).isLoading;
export const selectUsersError = (state) => selectUserBaseState(state).error;

// Example of a computed business-logic selector
export const selectTotalUsersCount = (state) => selectUserBaseState(state).list.length;
