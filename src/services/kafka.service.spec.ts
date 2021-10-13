import { KafkaCluster } from '../../electron/interfaces/kafka.interface'
import { ipcRenderer } from '../../__mocks__/electron'
import { KafkaService } from './kafka.service'

describe('KafkaService', () => {
  const cluster: KafkaCluster = {
    name: 'test cluster',
    bootstrapServers: ['localhost:9092']
  }

  beforeEach(() => {})

  afterEach(() => {})

  it('should succeed without an error', async () => {
    ipcRenderer.invoke = jest.fn(async (channel: string, args: any) => {
      return {
        ...args,
        payload: 'ok',
        error: null
      }
    })

    await KafkaService.checkConnect({
      cluster
    })

    expect(ipcRenderer.invoke).toHaveBeenCalledTimes(1)
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('kafka', {
      clusterName: cluster.name,
      command: 'CheckConnection',
      payload: cluster
    })
  })

  it('should succeed and return the response payload', async () => {
    const describeClusterResponse = {
      brokers: [
        {
          nodeId: 1001,
          host: 'localhost',
          port: 9092
        }
      ],
      controller: null,
      clusterId: 'test-cluster'
    }
    ipcRenderer.invoke = jest.fn(async (channel: string, args: any) => {
      return {
        ...args,
        payload: describeClusterResponse,
        error: null
      }
    })

    const response = await KafkaService.describeCluster({
      clusterName: cluster.name
    })

    expect(ipcRenderer.invoke).toHaveBeenCalledTimes(1)
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('kafka', {
      clusterName: cluster.name,
      command: 'DescribeCluster',
      payload: cluster.name
    })
    expect(response).toEqual(describeClusterResponse)
  })

  it('should throw an error on invalid response', async () => {
    ipcRenderer.invoke = jest.fn(async (channel: string, args: any) => {
      return {
        ...args,
        payload: null,
        error: 'failed'
      }
    })

    await expect(
      KafkaService.checkConnect({
        cluster
      })
    ).rejects.toEqual(new Error('failed'))
    expect(ipcRenderer.invoke).toHaveBeenCalledTimes(1)
    expect(ipcRenderer.invoke).toHaveBeenCalledWith('kafka', {
      clusterName: cluster.name,
      command: 'CheckConnection',
      payload: cluster
    })
  })
})
