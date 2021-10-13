import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
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
import { KafkaService } from '../services/kafka.service'
import { AppState } from './reducers/root.reducer'
import {
  ActionTypes,
  ADD_CLUSTER,
  ADD_MESSAGE,
  CHECK_CLUSTER,
  CONNECT_CLUSTER,
  DELETE_CLUSTER,
  DESCRIBE_CLUSTER,
  DESCRIBE_CONFIGS,
  DESCRIBE_GROUPS,
  DISCONNECT_CLUSTER,
  FETCH_TOPIC_METADATA,
  FETCH_TOPIC_OFFSETS,
  LIST_GROUPS,
  SELECT_CLUSTER,
  SET_LOADING
} from './types'

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export const setLoading = (isLoading: boolean): ActionTypes => {
  return {
    type: SET_LOADING,
    payload: isLoading
  }
}

export const addCluster = (cluster: KafkaCluster): ActionTypes => {
  return {
    type: ADD_CLUSTER,
    payload: cluster
  }
}

export const deleteCluster = (name: string): ActionTypes => {
  return {
    type: DELETE_CLUSTER,
    payload: {
      name
    }
  }
}

export const addMessage = (message: ParsedKafkaMessage): ActionTypes => {
  return {
    type: ADD_MESSAGE,
    payload: message
  }
}

// Base Action Parameters
type BaseActionArgs<T, S> = {
  payload?: T
  status?: any
  error?: string
  response?: S
}

// Base Action, used as a base for most other actions
const BaseAction = <T, S>(
  type: any,
  args: BaseActionArgs<T, S>
): ActionTypes => {
  const { payload, status, error, response } = args

  return {
    type, // this will fail if not set
    payload: payload as any,
    status,
    error,
    response: response as any
  }
}

export const checkCluster = (
  args: BaseActionArgs<KafkaCluster, string>
): ActionTypes => {
  return BaseAction<KafkaCluster, string>(CHECK_CLUSTER, args)
}

export const selectCluster = (
  args: BaseActionArgs<{ cluster: KafkaCluster }, boolean>
): ActionTypes => {
  return BaseAction<{ cluster: KafkaCluster }, boolean>(SELECT_CLUSTER, args)
}

export const connectCluster = (
  args: BaseActionArgs<{ cluster: KafkaCluster }, boolean>
): ActionTypes => {
  return BaseAction<{ cluster: KafkaCluster }, boolean>(CONNECT_CLUSTER, args)
}

export const disconnectCluster = (
  args: BaseActionArgs<{ clusterName: string }, undefined>
): ActionTypes => {
  return BaseAction<{ clusterName: string }, undefined>(
    DISCONNECT_CLUSTER,
    args
  )
}

export const describeCluster = (
  args: BaseActionArgs<undefined, KafkaDescribeClusterResponse>
) => {
  return BaseAction<undefined, KafkaDescribeClusterResponse>(
    DESCRIBE_CLUSTER,
    args
  )
}

export const describeConfigs = (
  args: BaseActionArgs<{ brokerId: string }, KafkaDescribeConfigsResponse>
) => {
  return BaseAction<{ brokerId: string }, KafkaDescribeConfigsResponse>(
    DESCRIBE_CONFIGS,
    args
  )
}

export const fetchTopicMetadata = (
  args: BaseActionArgs<
    { topics: string[] | undefined },
    KafkaFetchTopicMetadataResponse
  >
) => {
  return BaseAction<
    { topics: string[] | undefined },
    KafkaFetchTopicMetadataResponse
  >(FETCH_TOPIC_METADATA, args)
}

export const fetchTopicOffsets = (
  args: BaseActionArgs<{ topic: string }, KafkaFetchTopicOffsetsResponse>
) => {
  return BaseAction<{ topic: string }, KafkaFetchTopicOffsetsResponse>(
    FETCH_TOPIC_OFFSETS,
    args
  )
}

export const listGroups = (
  args: BaseActionArgs<undefined, KafkaListGroupsResponse>
) => {
  return BaseAction<undefined, KafkaListGroupsResponse>(LIST_GROUPS, args)
}

export const describeGroups = (
  args: BaseActionArgs<{ groups: string[] }, KafkaDescribeGroupsResponse>
) => {
  return BaseAction<{ groups: string[] }, KafkaDescribeGroupsResponse>(
    DESCRIBE_GROUPS,
    args
  )
}

export const handleSelectCluster = (
  name: string
): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const state: AppState = getState()
  const cluster = state.cluster.find(cluster => cluster.name === name)
  console.log(name)
  console.log(cluster)

  if (!cluster) {
    return
  }

  return dispatch(
    handleKafkaAction<{ cluster: KafkaCluster }, boolean>(
      selectCluster,
      KafkaService.connect,
      {
        cluster
      },
      false
    )
  )
}

export const handleConnectCluster = (
  cluster: KafkaCluster
): AppThunk => async dispatch => {
  dispatch(
    handleKafkaAction<{ cluster: KafkaCluster }, boolean>(
      connectCluster,
      KafkaService.connect,
      {
        cluster
      },
      false
    )
  )
}

export const handleDisconnectCluster = (
  clusterName: string
): AppThunk => async dispatch => {
  dispatch(
    handleKafkaAction<{ clusterName: string }, undefined>(
      disconnectCluster,
      KafkaService.disconnect,
      {
        clusterName
      },
      false
    )
  )
}

export const handleDescribeCluster = (): AppThunk<Promise<
  void
>> => async dispatch => {
  return dispatch(
    handleKafkaAction<undefined, KafkaDescribeClusterResponse>(
      describeCluster,
      KafkaService.describeCluster
    )
  )
}

export const handleDescribeConfigs = (
  brokerId: string
): AppThunk => async dispatch => {
  dispatch(
    handleKafkaAction<{ brokerId: string }, KafkaDescribeConfigsResponse>(
      describeConfigs,
      KafkaService.describeConfigs,
      {
        brokerId: brokerId
      }
    )
  )
}

export const handleFetchTopicMetadata = (
  topics?: string[]
): AppThunk<Promise<void>> => async dispatch => {
  return dispatch(
    handleKafkaAction<
      { topics: string[] | undefined },
      KafkaFetchTopicMetadataResponse
    >(fetchTopicMetadata, KafkaService.fetchTopicMetadata, {
      topics
    })
  )
}

export const handleFetchTopicOffsets = (
  topic: string
): AppThunk<Promise<void>> => async dispatch => {
  return dispatch(
    handleKafkaAction<{ topic: string }, KafkaFetchTopicOffsetsResponse>(
      fetchTopicOffsets,
      KafkaService.fetchTopicOffsets,
      {
        topic
      }
    )
  )
}

export const handleListGroups = (): AppThunk<Promise<
  void
>> => async dispatch => {
  return dispatch(
    handleKafkaAction<undefined, KafkaListGroupsResponse>(
      listGroups,
      KafkaService.listGroups
    )
  )
}

export const handleDescribeGroups = (): AppThunk => async (
  dispatch,
  getState
) => {
  const groups =
    getState().currentCluster?.groups?.map(group => group.groupId) || []

  dispatch(
    handleKafkaAction<{ groups: string[] }, KafkaDescribeGroupsResponse>(
      describeGroups,
      KafkaService.describeGroups,
      {
        groups
      }
    )
  )
}

export const handleKafkaAction = <T, S>(
  action: (args: BaseActionArgs<T, S>) => ActionTypes,
  func: Function,
  payload?: T | null | any,
  requiresConnection: boolean = true
): AppThunk<Promise<void>> => async (dispatch, getState) => {
    return handleLoading(dispatch, async () => {
      const state: AppState = getState()

      // if command requires a connection and no connection was established
      // throw an error
      if (
        requiresConnection &&
      (!state.currentCluster || !state.currentCluster.state?.isAvailable)
      ) {
        dispatch(
          action({
            payload,
            status: 'error',
            error: 'No active connection to cluster'
          })
        )
      }

      const clusterName = state.currentCluster?.name || ''

      // try to execute the given function, if it succeeds
      // return 'success', if it fails return an 'error'
      try {
        const response = await func({
          clusterName,
          ...payload
        })

        dispatch(
          action({
            payload,
            status: 'success',
            response
          })
        )
      } catch (err) {
        dispatch(
          action({
            payload,
            status: 'error',
            error: err
          })
        )
      }
    })
  }

export const handleCheckCluster = (
  cluster: KafkaCluster
): AppThunk => async dispatch => {
  handleLoading(dispatch, async () => {
    try {
      await KafkaService.checkConnect({
        cluster
      })

      dispatch(
        checkCluster({
          payload: cluster,
          status: 'success',
          response: 'ok'
        })
      )
    } catch (err) {
      dispatch(
        checkCluster({
          payload: cluster,
          status: 'error',
          error: err
        })
      )
    }
  })
}

/**
 * Wrap a function call inside a function which sets
 * the loading state to true, while the given function
 * is executed.
 */
const handleLoading = async (dispatch: Function, func: Function) => {
  dispatch(setLoading(true))

  await func()

  dispatch(setLoading(false))
}
