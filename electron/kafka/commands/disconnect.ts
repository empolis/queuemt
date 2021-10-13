import { KafkaCommandRequest } from '../../interfaces/kafka.interface'
import { ConnectionManager } from '../connection-manager'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to disconnect from the specified cluster
 */
export default class Disconnect implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'Disconnect'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<string>
  ): Promise<boolean> {
    if (!connection) {
      return true
    }

    await ConnectionManager.disconnect(args.payload)

    return true
  }
}
