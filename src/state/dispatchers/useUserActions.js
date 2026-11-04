import { useDispatch } from 'react-redux';
import { getUsers, clearUserList } from '../reducers/userSlice';

export function useUserActions() {
  const dispatch = useDispatch();

  return {
    // Triggers our Axios tracking lifecycle thunk loop
    fetchUsers: () => dispatch(getUsers()),
    
    // Triggers local internal data mutations
    wipeUsers: () => dispatch(clearUserList()),
  };
}
