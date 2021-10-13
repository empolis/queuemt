import {
  KafkaCommandRequest,
  KafkaCommandResponse
} from '../interfaces/kafka.interface'
import { Commands } from './commands'
import AbstractCommand from './commands/abstract-command'
import { ConnectionManager } from './connection-manager'

export class CommandHandler {
  private readonly commands: typeof AbstractCommand[] = Object.values(Commands)

  public async handleCommand (
    args: KafkaCommandRequest<any>
  ): Promise<KafkaCommandResponse> {
    const command = this.getCommand(args.command)

    // if the command does not exist, return an error
    if (!command) {
      return {
        ...args,
        payload: 'Unknown command'
      }
    }

    // try to get the cluster connection, if it exists
    const connection = ConnectionManager.getConnection(args.clusterName)

    const result: { payload: any; error: any } = {
      payload: null,
      error: null
    }

    try {
      result.payload = await command.execute(connection, args)
    } catch (err) {
      result.error = err
    }

    return {
      ...args,
      ...result
    }
  }

  /**
   * Check if a command exists, if so return it, else return undefined
   *
   * @param cmd the commands name
   */
  private getCommand (cmd: string): typeof AbstractCommand | undefined {
    return this.commands.find(command => {
      return command.IDENTIFIER === cmd
    })
  }
}
