import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from "../redux/slices/security/authSlice";
import { userReducer } from '../redux/slices/security/userSlice';
import { themeReducer } from '../redux/slices/theme/themeSlice';
import { servicesReducer } from '../redux/slices/services/companyServicesSlice';

/* Creating a store with the reducers. */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
    services: servicesReducer
   },

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch