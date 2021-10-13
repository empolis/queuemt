import {
  KafkaCommandRequest,
  KafkaDescribeClusterResponse
} from '../../interfaces/kafka.interface'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to describe a cluster (brokers)
 */
export default class DescribeCluster implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'DescribeCluster'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<any>
  ): Promise<KafkaDescribeClusterResponse> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    return await connection.kafka.admin().describeCluster()
  }
}
