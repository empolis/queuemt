import KafkaConnection from '../kafka-connection'

export default abstract class AbstractCommand {
  public static readonly IDENTIFIER: string = AbstractCommand.name

  static async execute (
    connection: KafkaConnection | undefined,
    args: any
  ): Promise<any> {
    throw new Error('Method not implemented')
  }
}
