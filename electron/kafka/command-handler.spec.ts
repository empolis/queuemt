import {
  KafkaCommandRequest,
  KafkaListGroupsResponse
} from '../interfaces/kafka.interface'
import { CommandHandler } from './command-handler'
import ListGroups from './commands/list-groups'
import { ConnectionManager } from './connection-manager'
import KafkaConnection from './kafka-connection'

describe('command handler', () => {
  const listGroups: KafkaListGroupsResponse = {
    groups: [
      {
        groupId: 'test-group',
        protocolType: 'consumer'
      }
    ]
  }

  beforeAll(() => {
    ConnectionManager.getConnection = jest.fn((name: string) => {
      return undefined
    })
  })

  it('should return an response if connection is available', async () => {
    ListGroups.execute = jest.fn(
      async (
        connection: KafkaConnection | undefined,
        args: KafkaCommandRequest<any>
      ) => {
        return listGroups
      }
    )

    const commandHandler = new CommandHandler()
    const args = {
      command: 'ListGroups',
      clusterName: 'test-cluster',
      payload: ''
    }

    await expect(commandHandler.handleCommand(args)).resolves.toEqual({
      ...args,
      error: null,
      payload: listGroups
    })
  })

  it('should return an error if command execution fails', async () => {
    ListGroups.execute = jest.fn(
      async (
        connection: KafkaConnection | undefined,
        args: KafkaCommandRequest<any>
      ) => {
        throw new Error('No data')
      }
    )

    const commandHandler = new CommandHandler()
    const args = {
      command: 'ListGroups',
      clusterName: 'test-cluster',
      payload: ''
    }

    await expect(commandHandler.handleCommand(args)).resolves.toEqual({
      ...args,
      payload: null,
      error: new Error('No data')
    })
  })

  it('should return an error, if invalid command is specified', async () => {
    const commandHandler = new CommandHandler()
    const args = {
      command: 'invalidCommand',
      clusterName: 'test-cluster',
      payload: null
    }

    await expect(commandHandler.handleCommand(args)).resolves.toEqual({
      ...args,
      payload: 'Unknown command'
    })
  })
})
