import {
  KafkaCluster,
  KafkaDescribeClusterResponse,
  KafkaDescribeConfigsResponse,
  KafkaDescribeGroupsResponse,
  KafkaFetchTopicMetadataResponse,
  KafkaFetchTopicOffsetsResponse,
  KafkaListGroupsResponse
} from '../../../electron/interfaces/kafka.interface'
import {
  ActionTypes,
  CHECK_CLUSTER,
  DESCRIBE_CLUSTER,
  DESCRIBE_CONFIGS,
  DESCRIBE_GROUPS,
  FETCH_TOPIC_METADATA,
  FETCH_TOPIC_OFFSETS,
  LIST_GROUPS,
  SELECT_CLUSTER
} from '../types'
import currentClusterReducer from './current-cluster.reducer'

describe('current cluster reducer', () => {
  const cluster: KafkaCluster = {
    name: 'test cluster',
    bootstrapServers: ['localhost:9092']
  }

  const clusterDescription: KafkaDescribeClusterResponse = {
    brokers: [
      {
        host: 'localhost',
        nodeId: 1,
        port: 9092
      }
    ],
    clusterId: 'cluster-id',
    controller: null
  }

  const configsDescription: KafkaDescribeConfigsResponse = {
    throttleTime: 0,
    resources: [
      {
        resourceName: 'test',
        resourceType: 1,
        configEntries: [
          {
            configName: 'test',
            configSynonyms: [
              {
                configName: 'test',
                configSource: 0,
                configValue: 'test-value'
              }
            ],
            configValue: 'test-value',
            isDefault: true,
            isSensitive: false,
            readOnly: true
          }
        ],
        errorCode: 0,
        errorMessage: ''
      }
    ]
  }

  const groupsList: KafkaListGroupsResponse = {
    groups: [
      {
        groupId: 'test-group',
        protocolType: 'consumer'
      }
    ]
  }

  const groupsDescription: KafkaDescribeGroupsResponse = {
    groups: [
      {
        groupId: 'test-group',
        members: [
          {
            clientId: 'local-client',
            clientHost: 'localhost',
            memberAssignment: Buffer.alloc(4),
            memberId: 'member-id',
            memberMetadata: Buffer.alloc(4)
          }
        ],
        protocol: 'consumer',
        protocolType: 'protocol-type',
        state: 'online'
      }
    ]
  }

  const topicMetadata: KafkaFetchTopicMetadataResponse = [
    {
      name: 'test-topic',
      partitions: [
        {
          isr: [0],
          leader: 0,
          partitionErrorCode: 0,
          partitionId: 0,
          replicas: [0],
          offlineReplicas: [0]
        }
      ]
    },
    {
      name: 'second-topic',
      partitions: [
        {
          isr: [0],
          leader: 0,
          partitionErrorCode: 0,
          partitionId: 0,
          replicas: [0],
          offlineReplicas: [0]
        }
      ]
    }
  ]

  const topicOffsets: KafkaFetchTopicOffsetsResponse = {
    topic: 'test-topic',
    offsets: [
      {
        high: '1',
        low: '0',
        offset: '1',
        partition: 1
      }
    ]
  }

  it('should return the initial state', () => {
    expect(currentClusterReducer(undefined, {} as ActionTypes)).toEqual({})
  })

  it('should do nothing on select cluster if no status', () => {
    expect(
      currentClusterReducer(null, {
        type: SELECT_CLUSTER,
        payload: {
          cluster
        }
      })
    ).toBeNull()
  })

  it('should select the cluster from payload if success', () => {
    expect(
      currentClusterReducer(null, {
        type: SELECT_CLUSTER,
        payload: {
          cluster
        },
        status: 'success',
        error: undefined,
        response: undefined
      })
    ).toEqual({
      ...cluster,
      state: {
        isAvailable: true
      }
    })
  })

  it('should select the cluster and set status to not available if error', () => {
    expect(
      currentClusterReducer(null, {
        type: SELECT_CLUSTER,
        payload: {
          cluster
        },
        status: 'error',
        error: 'Timeout',
        response: undefined
      })
    ).toEqual({
      ...cluster,
      state: {
        error: 'Timeout',
        isAvailable: false
      }
    })
  })

  it('should set the cluster state according to CHECK_CLUSTER payload', () => {
    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: CHECK_CLUSTER,
          payload: cluster
        }
      )
    ).toEqual({
      ...cluster
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: CHECK_CLUSTER,
          payload: cluster,
          status: 'success',
          error: undefined,
          response: undefined
        }
      )
    ).toEqual({
      ...cluster,
      state: {
        isAvailable: true
      }
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: CHECK_CLUSTER,
          payload: cluster,
          status: 'error',
          error: 'failed',
          response: undefined
        }
      )
    ).toEqual({
      ...cluster,
      state: {
        isAvailable: false,
        error: 'failed'
      }
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: CHECK_CLUSTER,
          payload: cluster,
          status: 'error',
          error: undefined,
          response: undefined
        }
      )
    ).toEqual({
      ...cluster,
      state: {
        isAvailable: false,
        error: ''
      }
    })
  })

  it('should describe the cluster', () => {
    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: DESCRIBE_CLUSTER,
          payload: undefined
        }
      )
    ).toEqual({
      ...cluster
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: DESCRIBE_CLUSTER,
          payload: undefined,
          status: 'success',
          error: undefined,
          response: clusterDescription
        }
      )
    ).toEqual({
      ...cluster,
      cluster: clusterDescription
    })
  })

  it('should describe the cluster configs', () => {
    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: DESCRIBE_CONFIGS,
          payload: undefined
        }
      )
    ).toEqual({
      ...cluster
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: DESCRIBE_CONFIGS,
          payload: undefined,
          status: 'success',
          error: undefined,
          response: configsDescription
        }
      )
    ).toEqual({
      ...cluster,
      configs: configsDescription
    })
  })

  it('should describe the consumer groups', () => {
    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: DESCRIBE_GROUPS,
          payload: undefined
        }
      )
    ).toEqual({
      ...cluster
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: DESCRIBE_GROUPS,
          payload: undefined,
          status: 'success',
          error: undefined,
          response: groupsDescription
        }
      )
    ).toEqual({
      ...cluster,
      groups: groupsDescription.groups
    })
  })

  it('should fetch topic metadata', () => {
    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: FETCH_TOPIC_METADATA,
          payload: undefined
        }
      )
    ).toEqual({
      ...cluster
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: FETCH_TOPIC_METADATA,
          payload: undefined,
          status: 'success',
          error: undefined,
          response: topicMetadata
        }
      )
    ).toEqual({
      ...cluster,
      topics: topicMetadata
    })
  })

  it('should fetch topic offsets', () => {
    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: FETCH_TOPIC_OFFSETS,
          payload: undefined
        }
      )
    ).toEqual({
      ...cluster
    })

    expect(
      currentClusterReducer(
        {
          ...cluster,
          topics: topicMetadata
        },
        {
          type: FETCH_TOPIC_OFFSETS,
          payload: undefined,
          status: 'success',
          error: undefined,
          response: topicOffsets
        }
      )
    ).toEqual({
      ...cluster,
      topics: [
        {
          ...topicMetadata[0],
          offsets: topicOffsets.offsets
        },
        {
          ...topicMetadata[1]
        }
      ]
    })
  })

  it('should list groups', () => {
    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: LIST_GROUPS,
          payload: undefined
        }
      )
    ).toEqual({
      ...cluster
    })

    expect(
      currentClusterReducer(
        {
          ...cluster
        },
        {
          type: LIST_GROUPS,
          payload: undefined,
          status: 'success',
          error: undefined,
          response: groupsList
        }
      )
    ).toEqual({
      ...cluster,
      groups: groupsList.groups
    })
  })
})
