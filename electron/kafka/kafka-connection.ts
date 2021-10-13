import { Kafka, Consumer, Producer } from 'kafkajs'

export default class KafkaConnection {
  private _consumer: Consumer | undefined
  private _producer: Producer | undefined

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly _name: string,
    private readonly _bootstrapServers: string[],
    private readonly _kafka: Kafka
  ) {}

  get name (): string {
    return this._name
  }

  get kafka (): Kafka {
    return this._kafka
  }

  public getConsumer (): Consumer {
    if (!this._consumer) {
      throw new Error('Consumer does not exist')
    }

    return this._consumer
  }

  public setConsumer (consumer: Consumer) {
    if (this._consumer) {
      throw new Error('Consumer does already exist')
    }

    this._consumer = consumer
  }

  public removeConsumer () {
    this._consumer = undefined
  }

  public getProducer (): Producer {
    if (!this._producer) {
      throw new Error('Producer does not exist')
    }

    return this._producer
  }

  public setProducer (producer: Producer) {
    if (this._producer) {
      throw new Error('Producer does already exist')
    }

    this._producer = producer
  }

  public removeProducer () {
    this._producer = undefined
  }
}
