/* eslint-disable multiline-ternary */
import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  LinearProgress,
  Typography,
  withStyles
} from '@material-ui/core'
import { styles } from '../../styles'
import { DispatchFunctionType } from '../../App'
import { AppState } from '../../store/reducers/root.reducer'

import './Consumer.scss'
import { KafkaService } from '../../services/kafka.service'
import { ipcRenderer } from 'electron'
import { KafkaMessage } from 'kafkajs'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import JSONPretty from 'react-json-prettify'
import { githubGist } from 'react-json-prettify/dist/themes'
import moment from 'moment-timezone'
import { ParsedKafkaMessage } from '../../../electron/interfaces/kafka.interface'
import { CommonUtils } from '../../utils/common.utils'
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
}

class Consumer extends Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)

    this.state = {
      isLoading: true
    }
  }

  async componentDidMount () {
    document.title = `${this.props.match.params.topic} (Consumer) on ${this.props.match.params.cluster}`

    await KafkaService.addConsumer({
      clusterName: this.props.match.params.cluster,
      topic: this.props.match.params.topic
    })

    this.setState({
      isLoading: true
    })

    // listen for messages on the windows IPC channel
    ipcRenderer.on('message', (event, message: KafkaMessage) => {
      this.props.addMessage(CommonUtils.parseKafkaMessage(message))
    })
  }

  render () {
    return (
      <div className='landingPage--wrapper consumer--wrapper'>
        <Grid container spacing={0} className={this.props.classes.content}>
          <Grid
            container
            item
            xs={12}
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
})(connector(Consumer))
