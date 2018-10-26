import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

// export interface State {
//   isLoading: boolean;
// }

// const initialState = {
//   isLoading: false
// };

// export function appReducer(state = initialState, action) {
//   switch (action.type) {
//     case 'START_LOADING':
//       return {
//         isLoading: true
//       };
//       case 'STOP_LOADING':
//         return {
//           isLoading: false
//         };
//         default:
//           return state;
//   }
// }

import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
  ui: fromUI.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer
};

export const getUIState = createFeatureSelector<fromUI.State>('ui');
export const getIsLoading = createSelector(getUIState, fromUI.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(getAuthState, fromAuth.getIsAuthenticated);
