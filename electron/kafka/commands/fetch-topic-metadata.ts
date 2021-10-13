import {
  KafkaCommandRequest,
  KafkaFetchTopicMetadataResponse
} from '../../interfaces/kafka.interface'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to fetch topic metadata for either all or a specified topic
 */
export default class FetchTopicMetadata implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'FetchTopicMetadata'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<string[] | null>
  ): Promise<KafkaFetchTopicMetadataResponse> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    let data

    if (args.payload) {
      data = await connection.kafka.admin().fetchTopicMetadata({
        topics: args.payload
      })
    } else {
      data = await connection.kafka.admin().fetchTopicMetadata()
    }

    return data.topics
  }
}
