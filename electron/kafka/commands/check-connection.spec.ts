import { Kafka } from 'kafkajs'
import { KafkaCluster } from '../../interfaces/kafka.interface'
import KafkaConnection from '../kafka-connection'
import CheckConnection from './check-connection'

describe('check connection', () => {
  const cluster: KafkaCluster = {
    name: 'test-cluster',
    bootstrapServers: ['localhost:9092']
  }

  const kafka = new Kafka({
    brokers: cluster.bootstrapServers
  })

  const connection = new KafkaConnection(
    cluster.name,
    cluster.bootstrapServers,
    kafka
  )

  it('should return true if connection exists', async () => {
    await expect(
      CheckConnection.execute(connection, {} as any)
    ).resolves.toBeTruthy()
  })
})
