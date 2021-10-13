import { KafkaCluster } from '../../../electron/interfaces/kafka.interface'
import { ActionTypes, ADD_CLUSTER, DELETE_CLUSTER } from '../types'
import { initialState } from './root.reducer'

const clusterReducer = (
  // eslint-disable-next-line default-param-last
  state: KafkaCluster[] = initialState.cluster,
  action: ActionTypes
): KafkaCluster[] => {
  switch (action.type) {
    case ADD_CLUSTER:
      // if cluster already exists, do not updated the state to prevent
      // overwrites.
      if (state.find(cluster => cluster.name === action.payload.name)) {
        return state
      }

      // eslint-disable-next-line no-case-declarations
      const newCluster = state.slice()
      newCluster.push(action.payload)

      return newCluster
    case DELETE_CLUSTER:
      return state.filter(cluster => cluster.name !== action.payload.name)
    default:
      return state
  }
}

export default clusterReducer
