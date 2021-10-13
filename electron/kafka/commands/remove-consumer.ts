import { KafkaCommandRequest } from '../../interfaces/kafka.interface'
import AbstractCommand from './abstract-command'
import KafkaConnection from '../kafka-connection'

/**
 * Command to remove an existing consumer
 */
export default class RemoveConsumer implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'RemoveConsumer'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<string>
  ): Promise<boolean> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    const consumer = connection.getConsumer()
    consumer.pause([
      {
        topic: args.payload
      }
    ])

    return true
  }
}
