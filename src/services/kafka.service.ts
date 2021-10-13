import { ipcRenderer } from 'electron'
import { Message, RecordMetadata } from 'kafkajs'
import {
  KafkaCluster,
  KafkaCommandRequest,
  KafkaCommandResponse,
  KafkaDescribeClusterResponse,
  KafkaDescribeConfigsResponse,
  KafkaDescribeGroupsResponse,
  KafkaFetchTopicMetadataResponse,
  KafkaFetchTopicOffsetsResponse,
  KafkaListGroupsResponse
} from '../../electron/interfaces/kafka.interface'

export class KafkaService {
  public static async checkConnect (payload: {
    cluster: KafkaCluster
  }): Promise<any> {
    // check if cluster connection is working
    // returns 'ok' in case of success or error in case of failure
    await KafkaService.executeCommand({
      clusterName: payload.cluster.name,
      command: 'CheckConnection',
      payload: payload.cluster
    })
  }

  public static async connect (payload: {
    cluster: KafkaCluster
  }): Promise<boolean> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.cluster.name,
      command: 'Connect',
      payload: payload.cluster
    })

    return response.payload
  }

  public static async disconnect (payload: {
    clusterName: string
  }): Promise<any> {
    await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'Disconnect',
      payload: payload.clusterName
    })
  }

  public static async describeCluster (payload: {
    clusterName: string
  }): Promise<KafkaDescribeClusterResponse> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'DescribeCluster',
      payload: payload.clusterName
    })

    return response.payload
  }

  public static async describeConfigs (payload: {
    clusterName: string
    brokerId: string
  }): Promise<KafkaDescribeConfigsResponse> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'DescribeConfigs',
      payload: payload.brokerId
    })

    return response.payload
  }

  public static async fetchTopicMetadata (payload: {
    clusterName: string
    topics: string[]
  }): Promise<KafkaFetchTopicMetadataResponse> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'FetchTopicMetadata',
      payload: payload.topics
    })

    return response.payload
  }

  public static async fetchTopicOffsets (payload: {
    clusterName: string
    topic: string
  }): Promise<KafkaFetchTopicOffsetsResponse> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'FetchTopicOffsets',
      payload: payload.topic
    })

    return response.payload
  }

  public static async listGroups (payload: {
    clusterName: string
  }): Promise<KafkaListGroupsResponse> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'ListGroups',
      payload: payload.clusterName
    })

    return response.payload
  }

  public static async describeGroups (payload: {
    clusterName: string
    groups: string[]
  }): Promise<KafkaDescribeGroupsResponse> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'DescribeGroups',
      payload: payload.groups
    })

    return response.payload
  }

  public static async addConsumer (payload: {
    clusterName: string
    topic: string
  }): Promise<any> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'AddConsumer',
      payload: payload.topic
    })

    return response.payload
  }

  public static async removeConsumer (payload: {
    clusterName: string
    topic: string
  }): Promise<any> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'RemoveConsumer',
      payload: payload.topic
    })

    return response.payload
  }

  public static async produceMessage (payload: {
    clusterName: string
    topic: string
    message: Message
  }): Promise<RecordMetadata> {
    const response = await KafkaService.executeCommand({
      clusterName: payload.clusterName,
      command: 'ProduceMessage',
      payload: {
        topic: payload.topic,
        message: payload.message
      }
    })

    return response.payload
  }

  private static handleResponseError (response: KafkaCommandResponse) {
    if (response.error || !response.payload) {
      throw new Error(response.payload ? response.payload : response.error)
    }
  }

  private static async executeCommand (
    args: KafkaCommandRequest<any>
  ): Promise<KafkaCommandResponse> {
    const response = await ipcRenderer.invoke('kafka', args)

    // throws an error if the response indicated an error event
    this.handleResponseError(response)

    return response
  }
}
