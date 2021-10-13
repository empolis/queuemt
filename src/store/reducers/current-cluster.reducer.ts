import { ConnectedKafkaCluster } from '../../../electron/interfaces/kafka.interface'
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
import { initialState } from './root.reducer'

const currentClusterReducer = (
  // eslint-disable-next-line default-param-last
  state: ConnectedKafkaCluster | null = initialState.currentCluster,
  action: ActionTypes
): ConnectedKafkaCluster | null => {
  switch (action.type) {
    case CHECK_CLUSTER:
      if (state && action.status === 'success') {
        return {
          ...state,
          state: {
            isAvailable: true
          }
        }
      } else if (state && action.status === 'error') {
        return {
          ...state,
          state: {
            isAvailable: false,
            error: action.error?.toString() || ''
          }
        }
      }

      return state
    case SELECT_CLUSTER:
      if (action.payload && action.status === 'success') {
        return {
          name: action.payload.cluster.name,
          bootstrapServers: action.payload.cluster.bootstrapServers,
          state: {
            isAvailable: true
          }
        }
      } else if (action.payload && action.status === 'error') {
        return {
          name: action.payload.cluster.name,
          bootstrapServers: action.payload.cluster.bootstrapServers,
          state: {
            isAvailable: false,
            error: action.error?.toString() || ''
          }
        }
      }

      return state
    case DESCRIBE_CLUSTER:
      if (state && action.status === 'success' && action.response) {
        return {
          ...state,
          cluster: action.response
        }
      }

      return state
    case DESCRIBE_CONFIGS:
      if (state && action.status === 'success' && action.response) {
        return {
          ...state,
          configs: action.response
        }
      }

      return state
    case FETCH_TOPIC_METADATA:
      if (state && action.status === 'success' && action.response) {
        return {
          ...state,
          topics: action.response
        }
      }

      return state
    case FETCH_TOPIC_OFFSETS:
      if (
        state &&
        action.status === 'success' &&
        action.response &&
        state.topics
      ) {
        const topics = state.topics.map(topic => {
          if (action.response?.topic === topic.name) {
            return {
              ...topic,
              offsets: action.response.offsets
            }
          }

          return topic
        })

        return {
          ...state,
          topics
        }
      }

      return state
    case LIST_GROUPS:
      if (state && action.status === 'success' && action.response) {
        return {
          ...state,
          groups: action.response.groups
        }
      }

      return state
    case DESCRIBE_GROUPS:
      if (state && action.status === 'success' && action.response) {
        return {
          ...state,
          groups: action.response.groups
        }
      }

      return state
    default:
      return state
  }
}

export default currentClusterReducer
