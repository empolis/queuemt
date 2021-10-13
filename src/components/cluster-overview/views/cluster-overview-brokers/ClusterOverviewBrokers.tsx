import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withStyles
} from '@material-ui/core'
import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { DispatchFunctionType } from '../../../../App'
import { AppState } from '../../../../store/reducers/root.reducer'
import { DataGrid } from '@material-ui/data-grid'
import { styles } from '../../../../styles'

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

const configColumns = [
  { field: 'configName', headerName: 'Key', width: 500 },
  { field: 'configValue', headerName: 'Value', width: 500 },
  {
    field: 'readOnly',
    headerName: 'Read-Only',
    width: 130,
    valueFormatter: ({ value }: any) => (value ? 'Yes' : 'No')
  }
]

const ClusterOverviewBrokers = (props: Props) => {
  const getConfigEntries = () => {
    return (
      props.currentCluster?.configs?.resources
        ?.slice(0, 1)[0]
        .configEntries.map(configEntry => {
          return {
            ...configEntry,
            id: configEntry.configName.toLowerCase(),
            readOnly: configEntry.readOnly
          }
        }) || []
    )
  }

  return (
    <>
      <p>Brokers</p>
      <TableContainer component={Paper}>
        <Table className='' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Node ID</TableCell>
              <TableCell align='right'>Host</TableCell>
              <TableCell align='right'>Port</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.currentCluster?.cluster?.brokers.map(broker => {
              return (
                <TableRow key={broker.nodeId}>
                  <TableCell component='th' scope='row'>
                    {broker.nodeId}
                  </TableCell>
                  <TableCell align='right'>{broker.host}</TableCell>
                  <TableCell align='right'>{broker.port}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>
      <p>Settings</p>
      <DataGrid
        rows={getConfigEntries()}
        columns={configColumns}
        pageSize={10}
        autoHeight={true}
        className={props.classes.paper}
        loading={props.isLoading}
      />
    </>
  )
}

export default withStyles(styles, {
  withTheme: true
})(connector(ClusterOverviewBrokers))
