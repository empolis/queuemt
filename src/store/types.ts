import {
  KafkaCluster,
  KafkaDescribeClusterResponse,
  KafkaDescribeConfigsResponse,
  KafkaDescribeGroupsResponse,
  KafkaFetchTopicMetadataResponse,
  KafkaFetchTopicOffsetsResponse,
  KafkaListGroupsResponse,
  ParsedKafkaMessage
} from '../../electron/interfaces/kafka.interface'

export const SET_LOADING = 'SET_LOADING'
export const ADD_CLUSTER = 'ADD_CLUSTER'
export const DELETE_CLUSTER = 'REMOVE_CLUSTER'
export const CHECK_CLUSTER = 'CHECK_CLUSTER'
export const CONNECT_CLUSTER = 'CONNECT_CLUSTER'
export const DISCONNECT_CLUSTER = 'DISCONNECT_CLUSTER'
export const SELECT_CLUSTER = 'SELECT_CLUSTER'
export const DESCRIBE_CLUSTER = 'DESCRIBE_CLUSTER'
export const DESCRIBE_CONFIGS = 'DESCRIBE_CONFIGS'
export const FETCH_TOPIC_METADATA = 'FETCH_TOPIC_METADATA'
export const FETCH_TOPIC_OFFSETS = 'FETCH_TOPIC_OFFSETS'
export const LIST_GROUPS = 'LIST_GROUPS'
export const DESCRIBE_GROUPS = 'DESCRIBE_GROUPS'
export const ADD_MESSAGE = 'ADD_MESSAGE'

interface SetLoadingAction {
  type: typeof SET_LOADING
  payload: boolean
}

interface AddClusterAction {
  type: typeof ADD_CLUSTER
  payload: KafkaCluster
}

interface DeleteClusterAction {
  type: typeof DELETE_CLUSTER
  payload: { name: string }
}

interface BaseKafkaAction<T, S> {
  payload?: T
  status?: 'success' | 'error'
  error?: string
  response?: S
}

interface CheckClusterAction extends BaseKafkaAction<KafkaCluster, string> {
  type: typeof CHECK_CLUSTER
}

interface SelectClusterAction
  extends BaseKafkaAction<{ cluster: KafkaCluster }, boolean> {
  type: typeof SELECT_CLUSTER
}

interface ConnectCluster extends BaseKafkaAction<KafkaCluster, boolean> {
  type: typeof CONNECT_CLUSTER
}

interface DisconnectCluster extends BaseKafkaAction<string, undefined> {
  type: typeof DISCONNECT_CLUSTER
}

interface DescribeClusterAction
  extends BaseKafkaAction<null, KafkaDescribeClusterResponse> {
  type: typeof DESCRIBE_CLUSTER
}

interface DescribeConfigsAction
  extends BaseKafkaAction<string, KafkaDescribeConfigsResponse> {
  type: typeof DESCRIBE_CONFIGS
}

interface FetchTopicMetadataAction
  extends BaseKafkaAction<null, KafkaFetchTopicMetadataResponse> {
  type: typeof FETCH_TOPIC_METADATA
}

interface FetchTopicOffsetsAction
  extends BaseKafkaAction<string, KafkaFetchTopicOffsetsResponse> {
  type: typeof FETCH_TOPIC_OFFSETS
}

interface ListGroupsAction
  extends BaseKafkaAction<null, KafkaListGroupsResponse> {
  type: typeof LIST_GROUPS
}

interface DescribeGroups
  extends BaseKafkaAction<string[], KafkaDescribeGroupsResponse> {
  type: typeof DESCRIBE_GROUPS
}

interface AddMessageAction {
  type: typeof ADD_MESSAGE
  payload: ParsedKafkaMessage
}

export type ActionTypes =
  | SetLoadingAction
  | AddClusterAction
  | DeleteClusterAction
  | SelectClusterAction
  | CheckClusterAction
  | ConnectCluster
  | DisconnectCluster
  | DescribeClusterAction
  | DescribeConfigsAction
  | FetchTopicMetadataAction
  | FetchTopicOffsetsAction
  | ListGroupsAction
  | DescribeGroups
  | AddMessageAction
