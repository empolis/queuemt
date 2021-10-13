import { combineReducers } from 'redux'
import {
  ConnectedKafkaCluster,
  KafkaCluster,
  ParsedKafkaMessage
} from '../../../electron/interfaces/kafka.interface'
import clusterReducer from './cluster.reducer'
import commonReducer from './common.reducer'
import currentClusterReducer from './current-cluster.reducer'
import messagesReducer from './messages.reducer'

export interface CommonState {
  isLoading: boolean
}

export interface AppState {
  common: CommonState
  cluster: KafkaCluster[]
  currentCluster: ConnectedKafkaCluster | null
  messages: ParsedKafkaMessage[]
}

const initialCommonState: CommonState = {
  isLoading: false
}

export const initialState: AppState = {
  common: initialCommonState,
  cluster: [],
  currentCluster: {} as ConnectedKafkaCluster,
  messages: []
}

const rootReducer = combineReducers({
  common: commonReducer || (() => {}),
  cluster: clusterReducer || (() => {}),
  currentCluster: currentClusterReducer || (() => {}),
  messages: messagesReducer || (() => {})
})

export default rootReducer
