import AddConsumer from './add-consumer'
import CheckConnection from './check-connection'
import Connect from './connect'
import DescribeCluster from './describe-cluster'
import DescribeConfigs from './describe-configs'
import DescribeGroups from './describe-groups'
import Disconnect from './disconnect'
import FetchTopicMetadata from './fetch-topic-metadata'
import FetchTopicOffsets from './fetch-topic-offsets'
import ListGroups from './list-groups'
import ProduceMessage from './produce-message'
import RemoveConsumer from './remove-consumer'

export const Commands = [
  CheckConnection,
  Connect,
  Disconnect,
  DescribeCluster,
  DescribeConfigs,
  FetchTopicMetadata,
  FetchTopicOffsets,
  ListGroups,
  DescribeGroups,
  AddConsumer,
  RemoveConsumer,
  ProduceMessage
]
