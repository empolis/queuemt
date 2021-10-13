import {
  KafkaCommandRequest,
  KafkaFetchTopicOffsetsResponse
} from '../../interfaces/kafka.interface'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to fetch topic offsets for a specific topic
 */
export default class FetchTopicOffsets implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'FetchTopicOffsets'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<string>
  ): Promise<KafkaFetchTopicOffsetsResponse> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    const data = await connection.kafka.admin().fetchTopicOffsets(args.payload)

    return {
      topic: args.payload,
      offsets: data
    }
  }
}
