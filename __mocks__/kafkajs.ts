import { AdminConfig, ConsumerConfig, Kafka, ProducerConfig } from 'kafkajs'

const KafkaMock = jest.createMockFromModule<{ Kafka: typeof Kafka }>('kafkajs')

KafkaMock.Kafka.prototype.consumer = (config?: ConsumerConfig | undefined) => {
  return {} as any
}

KafkaMock.Kafka.prototype.producer = (config?: ProducerConfig | undefined) => {
  return {} as any
}

KafkaMock.Kafka.prototype.admin = (config?: AdminConfig | undefined) => {
  return {
    connect: async () => jest.fn(),
    disconnect: async () => jest.fn()
  } as any
}

module.exports = KafkaMock
