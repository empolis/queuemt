import {
  KafkaCluster,
  KafkaCommandRequest
} from '../../interfaces/kafka.interface'
import { ConnectionManager } from '../connection-manager'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to check if a connection to specified cluster can be established
 */
export default class CheckConnection implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'CheckConnection'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<KafkaCluster>
  ): Promise<boolean> {
    if (connection) {
      return true
    }

    await ConnectionManager.connect(args.payload)
    await ConnectionManager.disconnect(args.payload.name, true)

    return true
  }
}
