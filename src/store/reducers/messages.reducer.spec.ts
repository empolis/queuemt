import { ParsedKafkaMessage } from '../../../electron/interfaces/kafka.interface'
import { ActionTypes, ADD_MESSAGE } from '../types'
import messagesReducer from './messages.reducer'

describe('messages reducer', () => {
  it('should return the initial state', () => {
    expect(messagesReducer(undefined, {} as ActionTypes)).toEqual([])
  })

  it('should add a message on ADD_MESSAGE', () => {
    expect(
      messagesReducer([], {
        type: ADD_MESSAGE,
        payload: {} as ParsedKafkaMessage
      })
    ).toEqual([{}])
  })

  it('should add new messages to the beginning of the array', () => {
    expect(
      messagesReducer(
        [
          {
            key: 'test-1'
          } as ParsedKafkaMessage
        ],
        {
          type: ADD_MESSAGE,
          payload: {
            key: 'test-2'
          } as ParsedKafkaMessage
        }
      )
    ).toEqual([
      {
        key: 'test-2'
      },
      {
        key: 'test-1'
      }
    ])
  })

  it('should remove the last message if more than 1000 messages are added', () => {
    const thousandMessagesArray = new Array<ParsedKafkaMessage>(1000).fill(
      {} as ParsedKafkaMessage,
      0,
      999
    )

    expect(thousandMessagesArray).toHaveLength(1000)

    expect(
      messagesReducer(thousandMessagesArray, {
        type: ADD_MESSAGE,
        payload: {} as ParsedKafkaMessage
      })
    ).toHaveLength(1000)
  })
})
