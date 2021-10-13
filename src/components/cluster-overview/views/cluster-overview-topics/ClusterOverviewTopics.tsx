import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { DispatchFunctionType } from '../../../../App'
import { AppState } from '../../../../store/reducers/root.reducer'
import { DataGrid, ValueFormatterParams } from '@material-ui/data-grid'
import {
  Button,
  ButtonGroup,
  Grid,
  TextField,
  withStyles
} from '@material-ui/core'
import { styles } from '../../../../styles'
import { ipcRenderer } from 'electron'

const mapState = (state: AppState) => ({
  isLoading: state.common.isLoading,
  currentCluster: state.currentCluster
})
const mapDispatchToProps = (dispatch: DispatchFunctionType) => ({})
const connector = connect(mapState, mapDispatchToProps)

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux & {
  classes: any
  history: any
}

interface State {
  filterValue: string
  appliedFilter: string
}

class ClusterOverviewTopics extends Component<Props, State> {
  private topicColumns = [
    { field: 'name', headerName: 'Name', width: 400 },
    { field: 'partitions', headerName: 'Partitions', width: 300 },
    {
      field: 'messages',
      headerName: 'Messages',
      width: 300
    },
    {
      field: 'button',
      headerName: 'Actions',
      width: 300,
      // eslint-disable-next-line react/display-name
      renderCell: (params: ValueFormatterParams) => <>{params.value}</>
    }
  ]

  constructor (props: Props, state: State) {
    super(props, state)

    this.state = {
      filterValue: '',
      appliedFilter: ''
    }

    this.updateFilter = this.updateFilter.bind(this)
  }

  async openConsumer (cluster: string, topic: string): Promise<any> {
    await ipcRenderer.invoke('window', {
      action: 'open',
      name: `consumer-${topic}`,
      path: `/consumer/${cluster}/${topic}`
    })
  }

  async openProducer (cluster: string, topic: string): Promise<any> {
    await ipcRenderer.invoke('window', {
      action: 'open',
      name: `producer-${topic}`,
      path: `/producer/${cluster}/${topic}`
    })
  }

  updateFilter (event: any) {
    const value = event.target.value

    try {
      // eslint-disable-next-line no-new
      new RegExp(value) // test if filter is valid regex
      this.setState({
        filterValue: value,
        appliedFilter: value
      } as State)
    } catch (e) {
      console.log(
        'unable to update topic filter: invalid regex "' + value + '"'
      )
      this.setState({
        filterValue: value,
        appliedFilter: this.state.appliedFilter
      } as State)
    }
  }

  private getTopics () {
    const regex = new RegExp(this.state.appliedFilter, 'i')
    return (
      this.props.currentCluster?.topics
        ?.filter(topic => regex.test(topic.name))
        .map(topic => {
          return {
            ...topic,
            id: topic.name.toLowerCase(),
            partitions: topic.partitions.length,
            messages: topic.offsets
              ?.map(offset => {
                return +offset.offset
              })
              .reduce((acc, offset) => {
                acc += offset

                return acc
              }),
            button: (
              <>
                <ButtonGroup variant='contained' disableElevation>
                  <Button
                    color='primary'
                    onClick={async () =>
                      await this.openConsumer(
                        this.props.currentCluster?.name || '',
                        topic.name
                      )
                    }
                  >
                    Consumer
                  </Button>
                  <Button
                    color='secondary'
                    onClick={async () =>
                      await this.openProducer(
                        this.props.currentCluster?.name || '',
                        topic.name
                      )
                    }
                  >
                    Producer
                  </Button>
                </ButtonGroup>
              </>
            )
          }
        }) || []
    )
  }

  render () {
    return (
      <>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <p>Topics</p>
          </Grid>
          <Grid item xl={4} xs={6}>
            <TextField
              variant='outlined'
              label='Search'
              size='small'
              value={this.state.filterValue}
              onChange={this.updateFilter}
              color='primary'
              fullWidth
            />
          </Grid>
        </Grid>
        <DataGrid
          rows={this.getTopics()}
          columns={this.topicColumns}
          pageSize={10}
          autoHeight={true}
          disableSelectionOnClick={true}
          className={this.props.classes.paper}
          loading={this.props.isLoading}
        />
      </>
    )
  }
}

export default withStyles(styles, {
  withTheme: true
})(connector(ClusterOverviewTopics))
