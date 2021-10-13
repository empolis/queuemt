import {
  DescribeConfigResponse,
  GroupDescription,
  GroupDescriptions,
  GroupOverview,
  ITopicMetadata,
  Message,
  SeekEntry
} from 'kafkajs'

/**
 * Describes a non-connected Kafka cluster (internal)
 */
interface KafkaCluster {
  name: string
  bootstrapServers: string[]
  state?: KafkaClusterState
  username?: string
  password?: string
}

interface KafkaClusterState {
  isAvailable: boolean
  error?: string
}

/**
 * Describes a connected Kafka cluster (internal)
 */
interface ConnectedKafkaCluster extends KafkaCluster {
  cluster?: KafkaDescribeClusterResponse
  configs?: KafkaDescribeConfigsResponse
  topics?: KafkaFetchTopicMetadataResponse
  groups?: (GroupOverview | GroupDescription)[]
}

/**
 * Describes the base of a command from / to the backend
 */
interface BaseKafkaCommand {
  clusterName: string
  command: string
}

/**
 * Describes a command request to the backend
 */
interface KafkaCommandRequest<T> extends BaseKafkaCommand {
  payload: T
}

/**
 * Describes a command response from the backend
 */
interface KafkaCommandResponse extends BaseKafkaCommand {
  payload?: any
  error?: any
}

/**
 * Kafka Responses for commands (internal)
 */
interface KafkaDescribeClusterResponse {
  brokers: Array<{ nodeId: number; host: string; port: number }>
  controller: number | null
  clusterId: string
}

interface KafkaDescribeConfigsResponse extends DescribeConfigResponse {}

interface KafkaFetchTopicMetadataResponse
  extends Array<
    ITopicMetadata & {
      offsets?: (SeekEntry & {
        high: string
        low: string
      })[]
    }
  > {}

interface KafkaFetchTopicOffsetsResponse {
  topic: string
  offsets: (SeekEntry & {
    high: string
    low: string
  })[]
}

interface KafkaListGroupsResponse {
  groups: GroupOverview[]
}

interface KafkaDescribeGroupsResponse extends GroupDescriptions {}

/**
 * Parsed Kafka Message (internal format)
 * contains string message key and payload instead of Buffer
 */
interface ParsedKafkaMessage extends Message {
  keyString: string
  valueString: string
  valueParsed: any
  headersParsed: any
  timestamp: string
}

/**
 * Kafka Message Dump (internal format)
 */
interface KafkaMessageDump {
  key: string
  payload: string
  headers: {
    key: string
    value: string
  }[]
}

export {
  KafkaCluster,
  KafkaClusterState,
  KafkaCommandRequest,
  KafkaCommandResponse,
  KafkaDescribeClusterResponse,
  KafkaDescribeConfigsResponse,
  KafkaFetchTopicMetadataResponse,
  KafkaFetchTopicOffsetsResponse,
  KafkaListGroupsResponse,
  ConnectedKafkaCluster,
  KafkaDescribeGroupsResponse,
  ParsedKafkaMessage,
  KafkaMessageDump
}
