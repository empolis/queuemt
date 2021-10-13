import { ActionTypes, SET_LOADING } from '../types'
import { CommonState, initialState } from './root.reducer'

const commonReducer = (
  // eslint-disable-next-line default-param-last
  state: CommonState = initialState.common,
  action: ActionTypes
): CommonState => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    default:
      return state
  }
}

export default commonReducer
