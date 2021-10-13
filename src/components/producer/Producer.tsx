/* eslint-disable multiline-ternary */
import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core'
import { styles } from '../../styles'
import { DispatchFunctionType } from '../../App'
import { AppState } from '../../store/reducers/root.reducer'

import './Producer.scss'
import { KafkaService } from '../../services/kafka.service'
import { Message, RecordMetadata } from 'kafkajs'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import JSONPretty from 'react-json-prettify'
import { githubGist } from 'react-json-prettify/dist/themes'
import moment from 'moment-timezone'
import CloseIcon from '@material-ui/icons/Close'
import { CommonUtils } from '../../utils/common.utils'
import {
  KafkaMessageDump,
  ParsedKafkaMessage
} from '../../../electron/interfaces/kafka.interface'
import { addMessage } from '../../store/actions'

const mapState = (state: AppState) => ({
  messages: state.messages
})
const mapDispatchToProps = (dispatch: DispatchFunctionType) => ({
  addMessage: (message: ParsedKafkaMessage) => dispatch(addMessage(message))
})
const connector = connect(mapState, mapDispatchToProps)

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux & {
  classes: any
  history: any
  match: any
}

interface State {
  isLoading: boolean
  key: string
  payload: string
  tabIndex: number
  isDirty: boolean
  headers: { key: string; value: string }[]
}

class Producer extends Component<Props, State> {
  private readonly inputNames: string[] = ['key', 'payload']

  constructor (props: Props, state: State) {
    super(props, state)

    this.state = {
      isLoading: true,
      key: '',
      payload: '',
      tabIndex: 0,
      isDirty: false,
      headers: [
        {
          key: 'app',
          value: 'queuemt'
        }
      ]
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleAddHeader = this.handleAddHeader.bind(this)
    this.handleRemoveHeader = this.handleRemoveHeader.bind(this)
    this.handleHeaderChange = this.handleHeaderChange.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.onClickImport = this.onClickImport.bind(this)
    this.onClickExport = this.onClickExport.bind(this)
    this.onClickClear = this.onClickClear.bind(this)
  }

  async componentDidMount () {
    document.title = `${this.props.match.params.topic} (Producer) on ${this.props.match.params.cluster}`

    this.setState({
      isLoading: false
    })
  }

  handleChange (event: any) {
    const name = event.target.name
    const value = event.target.value

    if (!this.inputNames.includes(name)) {
      return
    }

    this.setState({
      [name]: value,
      isDirty: false
    } as State)
  }

  handleTabChange (event: React.ChangeEvent<{}>, newIndex: number) {
    this.setState({
      tabIndex: newIndex
    })
  }

  handleAddHeader () {
    this.setState({
      headers: [
        ...this.state.headers,
        {
          key: '',
          value: ''
        }
      ]
    })
  }

  handleHeaderChange (event: any, index: number) {
    const name = event.target.name
    const value = event.target.value

    const newHeaders = [...this.state.headers]

    if (name === 'key') {
      newHeaders[index].key = value.trim()
    } else if (name === 'value') {
      newHeaders[index].value = value
    }

    this.setState({
      headers: newHeaders
    })
  }

  handleRemoveHeader (index: number) {
    // do not fully delete first header item, just clear it
    if (index === 0 && this.state.headers.length === 1) {
      this.setState({
        headers: [
          {
            key: '',
            value: ''
          }
        ]
      })
    } else {
      const newHeaders = [...this.state.headers]
      newHeaders.splice(index, 1)

      this.setState({
        headers: newHeaders
      })
    }
  }

  async handleSendMessage () {
    if (!this.validateInputs()) {
      this.setState({
        isDirty: true
      })

      return
    }

    const message = this.createMessage()
    await this.sendMessage(message)

    this.props.addMessage(CommonUtils.parseKafkaMessage(message))
  }

  async sendMessage (message: Message): Promise<RecordMetadata> {
    const response = await KafkaService.produceMessage({
      clusterName: this.props.match.params.cluster,
      topic: this.props.match.params.topic,
      message
    })

    return response
  }

  private validateInputs () {
    return this.state.key.length !== 0 && this.state.payload.length !== 0
  }

  private createMessage (): Message {
    const validHeaders = this.state.headers.filter(header => {
      if (header.key.length > 0 && header.value.length > 0) {
        return true
      }

      return false
    })

    const newHeaders: { [key: string]: string } = {}
    validHeaders.map(header => {
      newHeaders[header.key] = header.value

      return null
    })

    return {
      key: this.state.key,
      value: this.state.payload,
      headers: newHeaders
    }
  }

  private dumpRequest (): KafkaMessageDump {
    return {
      key: this.state.key,
      payload: this.state.payload,
      headers: this.state.headers
    }
  }

  private loadDump (dump: KafkaMessageDump) {
    if (!dump.key || !dump.payload) {
      return
    }

    this.setState({
      key: dump.key,
      payload: dump.payload,
      headers: dump.headers
    })
  }

  private onClickExport () {
    if (!this.validateInputs()) {
      this.setState({
        isDirty: true
      })

      return
    }

    const dumpObject = this.dumpRequest()
    CommonUtils.saveFile(
      `${this.state.key}-${this.props.match.params.topic}.json`,
      JSON.stringify(dumpObject)
    )
  }

  private async onClickImport () {
    try {
      const content = await CommonUtils.loadFile()
      const dump = JSON.parse(content)

      this.loadDump(dump)
    } catch (err) {}
  }

  private onClickClear () {
    this.setState({
      key: '',
      payload: '',
      headers: [
        {
          key: 'app',
          value: 'queuemt'
        }
      ]
    })
  }

  render () {
    return (
      <div className='landingPage--wrapper producer--wrapper'>
        <Grid container spacing={0} className={this.props.classes.content}>
          <Grid item xs={6}>
            <Tabs
              orientation='horizontal'
              variant='fullWidth'
              value={this.state.tabIndex}
              onChange={this.handleTabChange}
              centered
              indicatorColor='primary'
              textColor='primary'
              className='producer--inputs-tabs'
            >
              <Tab label='Basic' />
              <Tab label='Headers' />
            </Tabs>
            <Container>
              <div
                role='tabpanel'
                hidden={this.state.tabIndex !== 0}
                className='producer--inputs-wrapper'
              >
                <TextField
                  label='Key'
                  placeholder='Key'
                  fullWidth
                  variant='outlined'
                  name='key'
                  color='primary'
                  value={this.state.key}
                  onChange={this.handleChange}
                  error={this.state.isDirty && this.state.key.length === 0}
                />
                <TextField
                  label='Payload'
                  multiline
                  rows={10}
                  placeholder='Payload'
                  fullWidth
                  variant='outlined'
                  name='payload'
                  color='primary'
                  value={this.state.payload}
                  onChange={this.handleChange}
                  error={this.state.isDirty && this.state.payload.length === 0}
                />
              </div>
              <div
                role='tabpanel'
                hidden={this.state.tabIndex !== 1}
                className='producer--inputs-wrapper'
              >
                {this.state.headers.map(({ key, value }, index) => {
                  return (
                    <div
                      className='producer--inputs-header-group'
                      key={`headers-${index}`}
                    >
                      <TextField
                        color='primary'
                        label='Key'
                        name='key'
                        value={key}
                        onChange={e => this.handleHeaderChange(e, index)}
                      />
                      <TextField
                        color='primary'
                        label='Value'
                        name='value'
                        value={value}
                        onChange={e => this.handleHeaderChange(e, index)}
                      />
                      <IconButton
                        edge='end'
                        aria-label='close'
                        onClick={() => this.handleRemoveHeader(index)}
                      >
                        <CloseIcon fontSize='small' />
                      </IconButton>
                    </div>
                  )
                })}
                <div className='producer--inputs-header-group'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={this.handleAddHeader}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <Button
                variant='contained'
                size='large'
                color='primary'
                fullWidth
                onClick={this.handleSendMessage}
              >
                Send
              </Button>
              <br></br>
              <br></br>
              <ButtonGroup variant='outlined' size='large' fullWidth>
                <Button color='primary' onClick={this.onClickImport}>
                  Import
                </Button>
                <Button color='secondary' onClick={this.onClickExport}>
                  Export
                </Button>
                <Button color='default' onClick={this.onClickClear}>
                  Clear
                </Button>
              </ButtonGroup>
            </Container>
          </Grid>
          <Grid
            container
            item
            xs={6}
            className={`consumer--messages-grid full-height ${this.props.classes.content}`}
            spacing={0}
          >
            {this.props.messages.map((message, index) => {
              return (
                <Accordion
                  className={this.props.classes.accordion}
                  key={`message-${index}`}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography className={this.props.classes.heading}>
                      {moment
                        .utc(+message.timestamp)
                        .tz('Europe/Berlin')
                        .format('DD-MM-YYYY HH:mm:ss')}
                    </Typography>
                    <Typography className={this.props.classes.heading}>
                      {message.keyString}
                    </Typography>
                    <Typography className={this.props.classes.secondaryHeading}>
                      {message.valueString.length > 100
                        ? `${message.valueString.slice(0, 100)}...`
                        : message.valueString}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='h6'>Headers</Typography>
                  </AccordionDetails>
                  <AccordionDetails className='consumer--messages-headers'>
                    <JSONPretty
                      json={message.headersParsed}
                      theme={githubGist}
                    ></JSONPretty>
                  </AccordionDetails>
                  <AccordionDetails>
                    <Typography variant='h6'>Payload</Typography>
                  </AccordionDetails>
                  <AccordionDetails className='consumer--messages-payload'>
                    {message.valueParsed ? (
                      <JSONPretty
                        json={message.valueParsed}
                        theme={githubGist}
                      ></JSONPretty>
                    ) : (
                      <>{message.valueString}</>
                    )}
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Grid>
        </Grid>
        <LinearProgress
          hidden={!this.state.isLoading}
          className='progressBar'
          color='primary'
        />
      </div>
    )
  }
}

export default withStyles(styles, {
  withTheme: true
})(connector(Producer))
