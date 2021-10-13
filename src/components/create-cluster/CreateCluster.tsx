/* eslint-disable multiline-ternary */
import React, { Component } from 'react'
import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  TextField,
  withStyles,
  Zoom
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import LinkIcon from '@material-ui/icons/Link'
import { KafkaCluster } from '../../../electron/interfaces/kafka.interface'

import 'fontsource-roboto/100.css'
import 'fontsource-roboto/300.css'
import 'fontsource-roboto/500.css'
import { connect, ConnectedProps } from 'react-redux'
import { AppState } from '../../store/reducers/root.reducer'
import {
  addCluster,
  handleCheckCluster,
  selectCluster
} from '../../store/actions'
import { DispatchFunctionType } from '../../App'

import './CreateCluster.scss'
import { styles } from '../../styles'

const mapState = (state: AppState) => ({
  isLoading: state.common.isLoading,
  currentCluster: state.currentCluster
})
const mapDispatchToProps = (dispatch: DispatchFunctionType) => ({
  addCluster: (cluster: KafkaCluster) => dispatch(addCluster(cluster)),
  selectCluster: (cluster: KafkaCluster) => dispatch(selectCluster(cluster)),
  handleCheckCluster: (cluster: KafkaCluster) =>
    dispatch(handleCheckCluster(cluster))
})
const connector = connect(mapState, mapDispatchToProps)

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux & {
  classes: any
  history: any
  match: any
}

interface State {
  isDirty: boolean
  error: string
  clusterName: string
  clusterBootstrapservers: string
  username: string
  password: string
}

class CreateCluster extends Component<Props, State> {
  private readonly inputNames: string[] = [
    'clusterName',
    'clusterBootstrapservers',
    'username',
    'password'
  ]

  constructor (props: Props, state: State) {
    super(props, state)

    const clusterName = decodeURIComponent(this.props.match.params.clusterName || '')
    const clusterBootstrapservers = decodeURIComponent(this.props.match.params.bootstrapServer || '')

    this.state = {
      isDirty: true,
      error: '',
      clusterName,
      clusterBootstrapservers,
      username: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.onClickCheckCluster = this.onClickCheckCluster.bind(this)
    this.onClickBack = this.onClickBack.bind(this)
    this.onClickDone = this.onClickDone.bind(this)
  }

  componentDidUpdate (prevProps: Props, prevState: State, snapshot: any) {
    if (prevProps.currentCluster !== this.props.currentCluster) {
      this.setState({
        isDirty: !this.props.currentCluster?.state?.isAvailable,
        error: this.props.currentCluster?.state?.error || ''
      })
    }
  }

  onClickCheckCluster () {
    let error = ''

    if (!this.state.clusterName) {
      error = 'Please set a name for the cluster'
    } else if (!this.state.clusterBootstrapservers) {
      error = 'Please set at least one bootstrap server for the cluster'
    }

    this.setState({
      error
    })

    if (error) {
      return
    }

    const cluster: KafkaCluster = {
      name: this.state.clusterName,
      bootstrapServers: this.state.clusterBootstrapservers.split(','),
      username: this.state.username,
      password: this.state.password
    }

    this.props.selectCluster(cluster)
    this.props.handleCheckCluster(cluster)
  }

  onClickBack () {
    this.props.history.push('/')
  }

  onClickDone () {
    const cluster: KafkaCluster = {
      name: this.state.clusterName,
      bootstrapServers: this.state.clusterBootstrapservers.split(','),
      username: this.state.username,
      password: this.state.password
    }

    this.props.addCluster(cluster)
    this.props.history.push('/')
  }

  handleChange (event: any) {
    const name = event.target.name
    const value = event.target.value

    if (!this.inputNames.includes(name)) {
      return
    }

    this.setState({
      [name]: value,
      isDirty: true
    } as State)
  }

  render () {
    return (
      <div className={`createCluster--wrapper ${this.props.classes.content}`}>
        <Grid
          container
          className='gridInputs'
          justify='center'
          direction='column'
        >
          <Grid item container spacing={6} justify='center'>
            <Grid item xs={5}>
              <TextField
                label='Cluster Name'
                variant='outlined'
                fullWidth
                value={this.state.clusterName}
                name='clusterName'
                onChange={this.handleChange}
                color='primary'
              />
            </Grid>
            <Grid item xs={5} direction='column'>
              <TextField
                label='Bootstrap Servers'
                variant='outlined'
                fullWidth
                value={this.state.clusterBootstrapservers}
                name='clusterBootstrapservers'
                placeholder='kafka-1:9092,kafka-2:9092,...'
                color='primary'
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={5} direction='column'>
              <TextField
                label='Kafka-Username (Optional)'
                variant='outlined'
                fullWidth
                value={this.state.username}
                name='username'
                placeholder='admin'
                color='primary'
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={5} direction='column'>
              <TextField
                label='Kafka-Password (Optional)'
                variant='outlined'
                fullWidth
                value={this.state.password}
                name='password'
                placeholder='admin'
                color='primary'
                onChange={this.handleChange}
              />
            </Grid>
            <Grid container item xs={8} direction='column' justify='center'>
              <Button
                variant='outlined'
                color='primary'
                startIcon={this.props.isLoading ? undefined : <LinkIcon />}
                onClick={this.onClickCheckCluster}
                disabled={this.props.isLoading}
              >
                {this.props.isLoading ? (
                  <CircularProgress size={24} color='primary' />
                ) : (
                  'Check'
                )}
              </Button>
            </Grid>
            <Grid item xs={8} className='gridInputs--error'>
              <p>{this.state.error}</p>
            </Grid>
          </Grid>
        </Grid>
        <div className='fab--wrapper fab--left'>
          <Zoom key='test' in={true} timeout={200} unmountOnExit>
            <Fab
              color='primary'
              variant='extended'
              className='fab--extended'
              onClick={this.onClickBack}
            >
              <NavigateBeforeIcon className='fab--icon' />
              Back
            </Fab>
          </Zoom>
        </div>
        <div className='fab--wrapper fab--right'>
          <Zoom key='test' in={true} timeout={200} unmountOnExit>
            <Fab
              color='secondary'
              variant='extended'
              className='fab--extended'
              disabled={this.state.isDirty}
              onClick={this.onClickDone}
            >
              <NavigateNextIcon className='fab--icon' />
              Done
            </Fab>
          </Zoom>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, {
  withTheme: true
})(connector(CreateCluster))
