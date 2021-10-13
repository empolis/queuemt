import { KafkaMessage, Message } from 'kafkajs'
import { ParsedKafkaMessage } from '../../electron/interfaces/kafka.interface'

export class CommonUtils {
  public static generateAvatarText (text: string) {
    const splittedText = text.split(' ')

    if (splittedText.length < 2) {
      return splittedText[0][0].toUpperCase()
    }

    return splittedText
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('')
  }

  public static parseKafkaMessage (
    message: KafkaMessage | Message
  ): ParsedKafkaMessage {
    if (!message.key || !message.value) {
      throw new Error('Malformed Kafka Message, missing key or value')
    }

    let key: string
    let value: string

    if (typeof message.key === 'string') {
      key = message.key
    } else {
      key = new TextDecoder('utf-8').decode(message.key)
    }

    if (typeof message.value === 'string') {
      value = message.value
    } else {
      value = new TextDecoder('utf-8').decode(message.value)
    }

    let valueParsed = null
    try {
      valueParsed = JSON.parse(value)
    } catch (err) {}

    const headerKeys = Object.keys(message.headers || {})
    const headersParsed: { [key: string]: string } = {}

    if (message.headers) {
      for (const key of headerKeys) {
        const value = message.headers[key]

        if (typeof value === 'object') {
          headersParsed[key] = new TextDecoder('utf-8').decode(value)
        } else {
          headersParsed[key] = value
        }
      }
    }

    return {
      ...message,
      keyString: key,
      valueString: value,
      valueParsed,
      headersParsed,
      timestamp: message.timestamp || Date.now().toString()
    }
  }

  public static saveFile (filename: string, content: string) {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })

    element.href = URL.createObjectURL(file)
    element.download = filename
    element.click()
  }

  public static loadFile (): Promise<string> {
    return new Promise((resolve, reject) => {
      const handleFile = (e: any) => {
        const files = e.target.files
        if (files.length < 1) {
          reject(new Error('No file selected'))
        }

        const file = files[0]
        const reader = new FileReader()
        reader.onload = onFileLoaded
        reader.readAsText(file)
      }

      const onFileLoaded = (e: any) => {
        const result = e.target.result

        resolve(result)
      }

      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.onchange = handleFile
      input.click()
    })
  }
}
