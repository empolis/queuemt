import { ResourceTypes } from 'kafkajs'
import {
  KafkaCommandRequest,
  KafkaDescribeConfigsResponse
} from '../../interfaces/kafka.interface'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to describe a clusters config
 */
export default class DescribeConfigs implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'DescribeConfigs'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<string>
  ): Promise<KafkaDescribeConfigsResponse> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    return await connection.kafka.admin().describeConfigs({
      includeSynonyms: true,
      resources: [
        {
          type: ResourceTypes.CLUSTER,
          name: args.payload
        }
      ]
    })
  }
}
