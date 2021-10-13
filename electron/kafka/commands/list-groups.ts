import {
  KafkaCommandRequest,
  KafkaListGroupsResponse
} from '../../interfaces/kafka.interface'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to list a clusters consumer groups
 */
export default class ListGroups implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'ListGroups'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<any>
  ): Promise<KafkaListGroupsResponse> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    return await connection.kafka.admin().listGroups()
  }
}
