import { Kafka } from 'kafkajs'
import { KafkaCluster } from '../interfaces/kafka.interface'
import KafkaConnection from './kafka-connection'

describe('kafka connection', () => {
  const cluster: KafkaCluster = {
    name: 'test-cluster',
    bootstrapServers: ['localhost:9092']
  }

  const kafka = new Kafka({
    brokers: cluster.bootstrapServers
  })

  let connection: KafkaConnection

  beforeEach(() => {
    connection = new KafkaConnection(
      cluster.name,
      cluster.bootstrapServers,
      kafka
    )
  })

  it('should throw an error if no consumer exists', () => {
    expect(() => connection.getConsumer()).toThrowError(
      'Consumer does not exist'
    )
  })

  it('should throw an error, if consumer is already set', () => {
    const consumer = kafka.consumer()
    connection.setConsumer(consumer)

    expect(() => connection.setConsumer(consumer)).toThrowError(
      'Consumer does already exist'
    )
  })

  it('should return the consumer, if a consumer exists', () => {
    const consumer = kafka.consumer()
    connection.setConsumer(consumer)

    expect(connection.getConsumer()).toEqual(consumer)
  })

  it('should remove the consumer', () => {
    const consumer = kafka.consumer()
    connection.setConsumer(consumer)

    expect(connection.getConsumer()).toEqual(consumer)

    connection.removeConsumer()
    expect(() => connection.getConsumer()).toThrowError(
      'Consumer does not exist'
    )
  })

  it('should throw an error if no producer exists', () => {
    expect(() => connection.getProducer()).toThrowError(
      'Producer does not exist'
    )
  })

  it('should throw an error, if producer is already set', () => {
    const producer = kafka.producer()
    connection.setProducer(producer)

    expect(() => connection.setProducer(producer)).toThrowError(
      'Producer does already exist'
    )
  })

  it('should return the producer, if a producer exists', () => {
    const producer = kafka.producer()
    connection.setProducer(producer)

    expect(connection.getProducer()).toEqual(producer)
  })

  it('should remove the producer', () => {
    const producer = kafka.producer()
    connection.setProducer(producer)

    expect(connection.getProducer()).toEqual(producer)

    connection.removeProducer()
    expect(() => connection.getProducer()).toThrowError(
      'Producer does not exist'
    )
  })
})
