import { KafkaMessage } from 'kafkajs'
import { KafkaCommandRequest } from '../../interfaces/kafka.interface'
import { getWindow } from '../../main'
import KafkaConnection from '../kafka-connection'
import AbstractCommand from './abstract-command'

/**
 * Command to add a consumer for a specific topic
 */
export default class AddConsumer implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'AddConsumer'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<string>
  ): Promise<boolean> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    let consumer = null

    try {
      // if a consumer exists, use this one
      consumer = connection.getConsumer()
    } catch (err) {
      // if no consumer exists, create a new one
      consumer = connection.kafka.consumer({
        groupId: 'queuemt-consumer'
      })
      connection.setConsumer(consumer)
      await consumer.connect()
      await consumer.subscribe({
        topic: /.*/,
        fromBeginning: false
      })
      consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          this.sendMessageToRenderer(topic, message)
        }
      })
    }

    return true
  }

  /**
   * Sends a message to the frontend consumer window using IPC an channel
   *
   * @param topic the topic the message was consumed from, used to identify the correct consumer window
   * @param message the message to send to the consumer window
   */
  static sendMessageToRenderer (topic: string, message: KafkaMessage) {
    const window = getWindow(`consumer-${topic}`)
    if (!window) {
      return
    }

    window.window.webContents.send('message', message)
  }
}
