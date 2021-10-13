import { Message, RecordMetadata } from 'kafkajs'
import { KafkaCommandRequest } from '../../interfaces/kafka.interface'
import KafkaConnection from '../kafka-connection'
import AbstractCommand from './abstract-command'

/**
 * Command to create a topic producer
 */
export default class ProduceMessage implements AbstractCommand {
  public static readonly IDENTIFIER: string = 'ProduceMessage'

  static async execute (
    connection: KafkaConnection | undefined,
    args: KafkaCommandRequest<{ topic: string; message: Message }>
  ): Promise<RecordMetadata> {
    if (!connection) {
      throw new Error('No connection to the cluster')
    }

    let producer = null

    try {
      // if a producer exists, use this one
      producer = connection.getProducer()
    } catch (err) {
      // if no consumer exists, create a new one
      producer = connection.kafka.producer()
      connection.setProducer(producer)
      await producer.connect()
    }

    const records = await producer.send({
      topic: args.payload.topic,
      messages: [args.payload.message]
    })

    return records[0]
  }
}
