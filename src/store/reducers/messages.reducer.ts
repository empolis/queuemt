import { ParsedKafkaMessage } from '../../../electron/interfaces/kafka.interface'
import { ActionTypes, ADD_MESSAGE } from '../types'
import { initialState } from './root.reducer'

const MAX_MESSAGES = 1000

const messagesReducer = (
  // eslint-disable-next-line default-param-last
  state: ParsedKafkaMessage[] = initialState.messages,
  action: ActionTypes
): ParsedKafkaMessage[] => {
  switch (action.type) {
    case ADD_MESSAGE:
      // eslint-disable-next-line no-case-declarations
      const newMessages = state.slice()
      newMessages.unshift(action.payload)

      // if number of messages exceeds the MAX_MESSAGE amount
      // remove the last element from the array
      if (newMessages.length > MAX_MESSAGES) {
        newMessages.pop()
      }

      return newMessages
    default:
      return state
  }
}

export default messagesReducer
