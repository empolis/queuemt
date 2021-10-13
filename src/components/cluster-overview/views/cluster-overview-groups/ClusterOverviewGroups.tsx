import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { AppState } from '../../../../store/reducers/root.reducer'
import { DataGrid } from '@material-ui/data-grid'
import { withStyles } from '@material-ui/core'
import { styles } from '../../../../styles'
import { GroupDescription } from 'kafkajs'

const mapState = (state: AppState) => ({
  isLoading: state.common.isLoading,
  currentCluster: state.currentCluster
})
const mapDispatchToProps = () => ({})
const connector = connect(mapState, mapDispatchToProps)

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux & {
  classes: any
  history: any
}

const groupColumns = [
  { field: 'groupId', headerName: 'Group ID', width: 400 },
  {
    field: 'protocolType',
    headerName: 'Protocol Type',
    width: 300,
    valueFormatter: ({ value }: any) =>
      value.slice(0, 1).toUpperCase() + value.slice(1)
  },
  { field: 'members', headerName: 'Members', width: 100 }
]

const ClusterOverviewGroups = (props: Props) => {
  const getGroups = () => {
    return (
      props.currentCluster?.groups?.map(group => {
        return {
          ...group,
          id: group.groupId.toLowerCase(),
          members: (group as GroupDescription).members?.length || 0
        }
      }) || []
    )
  }

  return (
    <>
      <p>Topics</p>
      <DataGrid
        rows={getGroups()}
        columns={groupColumns}
        pageSize={10}
        autoHeight={true}
        disableSelectionOnClick={true}
        className={props.classes.paper}
        loading={props.isLoading}
      />
    </>
  )
}

export default withStyles(styles, {
  withTheme: true
})(connector(ClusterOverviewGroups))
