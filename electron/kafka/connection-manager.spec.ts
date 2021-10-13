import { KafkaCluster } from '../interfaces/kafka.interface'
import { ConnectionManager } from './connection-manager'

describe('connection manager', () => {
  const cluster: KafkaCluster = {
    name: 'test-cluster',
    bootstrapServers: ['localhost:9092']
  }

  beforeEach(() => {})

  it('should add the connection on connect', async () => {
    expect(ConnectionManager.getConnection(cluster.name)).toBeUndefined()
    await expect(ConnectionManager.connect(cluster)).resolves.toBeUndefined()
    expect(ConnectionManager.getConnection(cluster.name)).toBeDefined()
  })

  it('should remove the connection on disconnect', async () => {
    await ConnectionManager.connect(cluster)

    expect(ConnectionManager.getConnection(cluster.name)).toBeDefined()
    await expect(
      ConnectionManager.disconnect(cluster.name)
    ).resolves.toBeUndefined()
    expect(ConnectionManager.getConnection(cluster.name)).toBeUndefined()
  })

  it('should throw an error on disconnecting from an unknown connection', async () => {
    expect(ConnectionManager.getConnection(cluster.name)).toBeUndefined()
    await expect(ConnectionManager.disconnect(cluster.name)).rejects.toEqual(
      new Error('Tried to disconnect from non-existing cluster')
    )
  })
})
