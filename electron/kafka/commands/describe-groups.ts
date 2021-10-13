import {
  KafkaCommandRequest,
  KafkaDescribeGroupsResponse
} from '../../interfaces/kafka.interface'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to describe a clusters consumer groups
 */
export default class DescribeGroups implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'DescribeGroups'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<string[]>
  ): Promise<KafkaDescribeGroupsResponse> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    return await connection.kafka.admin().describeGroups(args.payload)
  }
}
