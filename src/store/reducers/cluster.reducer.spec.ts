import { KafkaCluster } from '../../../electron/interfaces/kafka.interface'
import { ActionTypes, ADD_CLUSTER, DELETE_CLUSTER } from '../types'
import clusterReducer from './cluster.reducer'

describe('cluster reducer', () => {
  const cluster: KafkaCluster = {
    name: 'test cluster',
    bootstrapServers: ['localhost:9092']
  }

  it('should return the initial state', () => {
    expect(clusterReducer(undefined, {} as ActionTypes)).toEqual([])
  })

  it('should handle ADD_CLUSTER', () => {
    expect(
      clusterReducer([], {
        type: ADD_CLUSTER,
        payload: cluster
      })
    ).toEqual([
      {
        ...cluster
      }
    ])
  })

  it('should not add a cluster, if an cluster with the same name already exists', () => {
    expect(
      clusterReducer(
        [
          {
            ...cluster
          }
        ],
        {
          type: ADD_CLUSTER,
          payload: cluster
        }
      )
    ).toEqual([
      {
        ...cluster
      }
    ])
  })

  it('should handle DELETE_CLUSTER', () => {
    expect(
      clusterReducer(
        [
          {
            ...cluster
          }
        ],
        {
          type: DELETE_CLUSTER,
          payload: {
            name: cluster.name
          }
        }
      )
    ).toEqual([])
  })
})
