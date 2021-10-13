import { ActionTypes, SET_LOADING } from '../types'
import commonReducer from './common.reducer'

describe('common reducer', () => {
  it('should return the initial state', () => {
    expect(commonReducer(undefined, {} as ActionTypes)).toEqual({
      isLoading: false
    })
  })

  it('should set the state to the value of SET_LOADING', () => {
    expect(
      commonReducer(
        {
          isLoading: false
        },
        {
          type: SET_LOADING,
          payload: true
        }
      )
    ).toEqual({
      isLoading: true
    })
  })
})
