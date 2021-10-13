/* eslint-disable no-undef */
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core'
import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { DispatchFunctionType } from '../../App'
import { AppState } from '../../store/reducers/root.reducer'
import DnsIcon from '@material-ui/icons/Dns'
import ForumIcon from '@material-ui/icons/Forum'
import LinkIcon from '@material-ui/icons/Link'
import GroupWorkIcon from '@material-ui/icons/GroupWork'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import RefreshIcon from '@material-ui/icons/Refresh'

import './ClusterOverview.scss'
import {
  handleDescribeCluster,
  handleDescribeConfigs,
  handleDescribeGroups,
  handleDisconnectCluster,
  handleFetchTopicMetadata,
  handleFetchTopicOffsets,
  handleListGroups
} from '../../store/actions'
import ClusterOverviewBrokers from './views/cluster-overview-brokers/ClusterOverviewBrokers'
import ClusterOverviewTopics from './views/cluster-overview-topics/ClusterOverviewTopics'
import { styles } from '../../styles'
import ClusterOverviewGroups from './views/cluster-overview-groups/ClusterOverviewGroups'
import { ipcRenderer } from 'electron'

const mapState = (state: AppState) => ({
  isLoading: state.common.isLoading,
  currentCluster: state.currentCluster
})
const mapDispatchToProps = (dispatch: DispatchFunctionType) => ({
  handleDescribeCluster: async () => await dispatch(handleDescribeCluster()),
  handleDescribeConfigs: (brokerId: string) =>
    dispatch(handleDescribeConfigs(brokerId)),
  handleFetchTopicMetadata: async () =>
    await dispatch(handleFetchTopicMetadata()),
  handleFetchTopicOffsets: async (topic: string) =>
    await dispatch(handleFetchTopicOffsets(topic)),
  handleListGroups: async () => await dispatch(handleListGroups()),
  handleDescribeGroups: () => dispatch(handleDescribeGroups()),
  handleDisconnectCluster: (clusterName: string) =>
    dispatch(handleDisconnectCluster(clusterName))
})
const connector = connect(mapState, mapDispatchToProps)

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux & {
  classes: any
  history: any
  theme: any
}

interface State {
  currentView: {
    name: string
    component: Function | null
  }
}

class ClusterOverview extends Component<Props, State> {
  constructor (props: Props, state: State) {
    super(props, state)

    this.state = {
      currentView: {
        name: 'Brokers',
        component: ClusterOverviewBrokers
      }
    }

    this.onClickExit = this.onClickExit.bind(this)
    this.refreshData = this.refreshData.bind(this)
  }

  async componentDidMount () {
    await this.refreshData()
  }

  async refreshData () {
    // refresh all data
    await this.props.handleDescribeCluster()

    if (this.props.currentCluster?.cluster?.brokers) {
      // try to describe configs from each broker
      for (const broker of this.props.currentCluster.cluster.brokers) {
        this.props.handleDescribeConfigs(broker.nodeId.toString())
      }
    }

    await this.props.handleFetchTopicMetadata()

    if (this.props.currentCluster && this.props.currentCluster.topics) {
      for (const topic of this.props.currentCluster.topics) {
        await this.props.handleFetchTopicOffsets(topic.name)
      }
    }

    await this.props.handleListGroups()
    this.props.handleDescribeGroups()
  }

  /**
   * Convert an array of Kafka brokers to a string
   *
   * @param brokers an array of Kafka brokers
   */
  private static brokersToString (
    brokers: Array<{ nodeId: number; host: string; port: number }> | undefined
  ): string {
    if (!brokers) {
      return ''
    }

    return brokers.map(broker => `${broker.host}:${broker.port}`).join(', ')
  }

  async onClickExit () {
    if (this.props.currentCluster) {
      this.props.handleDisconnectCluster(this.props.currentCluster.name)
    }

    // return back to main menu
    this.props.history.push('/')

    await ipcRenderer.invoke('window', {
      action: 'unmaximize'
    })
  }

  render () {
    return (
      <>
        <div className='clusterOverview--wrapper'>
          <AppBar position='fixed' className='appBar' color='primary'>
            <Toolbar>
              <Typography variant='h6' noWrap className='appBar--title'>
                {this.state.currentView.name}
              </Typography>
              <IconButton edge='end' color='inherit' onClick={this.refreshData}>
                <RefreshIcon />
              </IconButton>
              <IconButton
                edge='start'
                color='inherit'
                className='appBar--icon'
                onClick={this.onClickExit}
              >
                <ExitToAppIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            variant='permanent'
            anchor='left'
            className='drawer'
            classes={{
              paper: 'drawer--paper'
            }}
          >
            <div />
            <Divider />
            {this.props.currentCluster && (
              <>
                <List>
                  <ListItem key='cluster'>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.currentCluster.name}
                      secondary={
                        this.props.currentCluster.cluster
                          ? ClusterOverview.brokersToString(
                              this.props.currentCluster.cluster.brokers
                            )
                          : ''
                      }
                    />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem
                    button
                    key='Brokers'
                    onClick={() =>
                      this.setState({
                        currentView: {
                          name: 'Brokers',
                          component: ClusterOverviewBrokers
                        }
                      })
                    }
                    selected={this.state.currentView.name === 'Brokers'}
                  >
                    <ListItemIcon>
                      <DnsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Brokers'
                      secondary={
                        this.props.currentCluster.cluster
                          ? this.props.currentCluster.cluster.brokers.length
                          : ''
                      }
                    />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem
                    button
                    key='Topics'
                    onClick={() =>
                      this.setState({
                        currentView: {
                          name: 'Topics',
                          component: ClusterOverviewTopics
                        }
                      })
                    }
                    selected={this.state.currentView.name === 'Topics'}
                  >
                    <ListItemIcon>
                      <ForumIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Topics'
                      secondary={
                        this.props.currentCluster.topics
                          ? this.props.currentCluster.topics.length
                          : ''
                      }
                    />
                  </ListItem>
                  <ListItem
                    button
                    key='Consumer Groups'
                    onClick={() =>
                      this.setState({
                        currentView: {
                          name: 'Consumer Groups',
                          component: ClusterOverviewGroups
                        }
                      })
                    }
                    selected={this.state.currentView.name === 'Consumer Groups'}
                  >
                    <ListItemIcon>
                      <GroupWorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Consumer Groups'
                      secondary={
                        this.props.currentCluster.groups
                          ? this.props.currentCluster.groups.length
                          : ''
                      }
                    />
                  </ListItem>
                </List>
              </>
            )}
          </Drawer>
          <main className={`content ${this.props.classes.content}`}>
            {this.state.currentView.component != null && (
              <this.state.currentView.component />
            )}
          </main>
        </div>
        <LinearProgress
          hidden={!this.props.isLoading}
          className='progressBar'
          color='primary'
        />
      </>
    )
  }
}

export default withStyles(styles, {
  withTheme: true
})(connector(ClusterOverview))
