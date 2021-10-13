import { Kafka } from 'kafkajs'
import { KafkaCluster } from '../interfaces/kafka.interface'
import KafkaConnection from './kafka-connection'

export class ConnectionManager {
  private static connections: KafkaConnection[] = []

  /**
   * Connects to the specified Kafka cluster
   *
   * @param cluster Kafka Cluster object
   */
  public static async connect (cluster: KafkaCluster): Promise<void> {
    let kafka: Kafka
    if (
      cluster.username &&
      cluster.username.length > 0 &&
      cluster.password &&
      cluster.password.length > 0
    ) {
      kafka = new Kafka({
        clientId: 'queuemt-connection',
        brokers: cluster.bootstrapServers,
        retry: {
          retries: 1
        },
        sasl: {
          mechanism: 'scram-sha-512',
          username: cluster.username,
          password: cluster.password
        }
      })
    } else {
      kafka = new Kafka({
        clientId: 'queuemt-connection',
        brokers: cluster.bootstrapServers,
        retry: {
          retries: 1
        }
      })
    }

    const kafkaConnection = new KafkaConnection(
      cluster.name,
      cluster.bootstrapServers,
      kafka
    )

    // Try to establish an admin connection to the cluster.
    // If no connection can be established and 5000ms passed,
    // throw an error
    await new Promise((resolve, reject) => {
      let connectionSuccessful = false
      kafka
        .admin()
        .connect()
        .then(() => {
          connectionSuccessful = true
          resolve()
        })
        .catch(reject)
      setTimeout(() => {
        if (connectionSuccessful) {
          resolve()
          return
        }

        reject(
          new Error('Timeout while trying to connect to the Kafka Cluster')
        )
      }, 5000)
    })

    this.connections.push(kafkaConnection)
  }

  /**
   * Disconnects the specified Kafka cluster
   *
   * @param name Name of the Kafka cluster
   */
  public static async disconnect (
    name: string,
    force: boolean = false
  ): Promise<void> {
    const connection = this.connections.find(
      connection => connection.name === name
    )

    if (!connection) {
      throw Error('Tried to disconnect from non-existing cluster')
    }

    // try to disconnect from admin
    try {
      await connection.kafka.admin().disconnect()
    } catch (err) {
      // if force is set to true, continue without throwing the error
      if (!force) {
        throw err
      }
    }

    // try to disconnect consumer and producer, if exists
    try {
      await connection.getConsumer().disconnect()
    } catch (err) {}

    try {
      await connection.getProducer().disconnect()
    } catch (err) {}

    // remove connection from global store
    this.connections = this.connections.filter(connection => {
      return connection.name !== name
    })
  }

  /**
   * If connected, returns a connection for the specified Kafka cluster
   *
   * @param name Name of the Kafka cluster
   */
  public static getConnection (name: string): KafkaConnection | undefined {
    return this.connections
      .filter(connection => {
        return connection.name === name
      })
      .pop()
  }
}
