import {
  KafkaCluster,
  KafkaCommandRequest
} from '../../interfaces/kafka.interface'
import { ConnectionManager } from '../connection-manager'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to establish a connection to the specified cluster
 */
export default class Connect implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'Connect'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<KafkaCluster>
  ): Promise<boolean> {
    if (connection) {
      return true
    }

    await ConnectionManager.connect(args.payload)

    return true
  }
}
