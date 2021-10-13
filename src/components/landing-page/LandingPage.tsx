import React, { Component } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { connect, ConnectedProps } from 'react-redux'
import { DispatchFunctionType } from '../../App'
import { AppState } from '../../store/reducers/root.reducer'

import './LandingPage.scss'
import { CommonUtils } from '../../utils/common.utils'
import { deleteCluster, handleSelectCluster } from '../../store/actions'
import { ipcRenderer } from 'electron'
import { styles } from '../../styles'

const mapState = (state: AppState) => ({
  isLoading: state.common.isLoading,
  cluster: state.cluster,
  currentCluster: state.currentCluster
})
const mapDispatchToProps = (dispatch: DispatchFunctionType) => ({
  deleteCluster: (name: string) => dispatch(deleteCluster(name)),
  handleSelectCluster: (name: string) => dispatch(handleSelectCluster(name))
})
const connector = connect(mapState, mapDispatchToProps)

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux & {
  classes: any
  history: any
}

interface State {
  showErrorDialog: boolean,
  showLicensesDialog: boolean
}

class LandingPage extends Component<Props, State> {
  private static readonly HOSTNAME_IP_REGEXP = /^((([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})|(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))):(\d+)/

  constructor (props: Props, state: State) {
    super(props, state)

    this.state = {
      showErrorDialog: false,
      showLicensesDialog: false
    }

    this.onClickCluster = this.onClickCluster.bind(this)
    this.onClickDeleteCluster = this.onClickDeleteCluster.bind(this)
  }

  async componentDidMount () {
    ipcRenderer.on('open-url', (event, data) => {
      this.onOpenUrl(data)
    })
  }

  async componentDidUpdate (prevProps: Props, prevState: State, snapshot: any) {
    // check if the new props contain any changes to currentCluster
    if (
      prevProps.currentCluster !== this.props.currentCluster &&
      this.props.currentCluster?.state
    ) {
      if (this.props.currentCluster.state.isAvailable === true) {
        this.props.history.push('/cluster-overview')

        await ipcRenderer.invoke('window', {
          action: 'maximize'
        })
      } else {
        this.setState({
          showErrorDialog: true
        })
      }
    }
  }

  onOpenUrl (data: string) {
    const clusterName = data.split('/')[0]
    const bootstrapServer = data.split('/')[1]

    const validBootstrapUrl = new RegExp(LandingPage.HOSTNAME_IP_REGEXP, 'gi').test(bootstrapServer)
    if (!validBootstrapUrl) {
      return
    }

    const cluster = this.props.cluster.find(cluster => cluster.bootstrapServers.includes(bootstrapServer))
    if (cluster) {
      this.props.handleSelectCluster(cluster.name)
    } else {
      this.props.history.push(`create-cluster/${encodeURIComponent(clusterName)}/${encodeURIComponent(bootstrapServer)}`)
    }
  }

  onClickCluster (name: string) {
    this.props.handleSelectCluster(name)
  }

  onClickDeleteCluster (name: string) {
    this.props.deleteCluster(name)
  }

  loadLicenses (): any {
    const licenses = require('../../assets/licenses.json')

    return Object.entries(licenses).map(([pkg, details]) => (
      <Accordion key={pkg} TransitionProps={{ unmountOnExit: true }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{pkg}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{ whiteSpace: 'pre-wrap', fontWeight: 300 }}>
            {(details as any).licenseText}
          </Typography>
        </AccordionDetails>
      </Accordion>
    ))
  }

  render () {
    const history = this.props.history

    return (
      <div className='landingPage--wrapper'>
        <Grid container spacing={0} className={this.props.classes.content}>
          <Grid item xs={4}>
            <List disablePadding>
              {this.props.cluster.map(cluster => {
                return (
                  <ListItem
                    key={cluster.name}
                    className='cluster--select'
                    onClick={() => this.onClickCluster(cluster.name)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {CommonUtils.generateAvatarText(cluster.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={cluster.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge='end'
                        aria-label='close'
                        onClick={() => this.onClickDeleteCluster(cluster.name)}
                      >
                        <CloseIcon fontSize='small' />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })}
            </List>
          </Grid>
          <Grid
            container
            item
            xs={8}
            className={`full-height ${this.props.classes.paper}`}
            direction='column'
            justify='center'
            alignItems='center'
          >
            <Typography style={{ fontWeight: 100 }} variant='h2' className='appName'>
              Queue
              <span className='text--bold'>MT</span>
            </Typography>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<AddIcon />}
              onClick={() => history.push('create-cluster')}
            >
              Add Cluster
            </Button>
          </Grid>
        </Grid>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <Button
            startIcon={<InfoOutlinedIcon />}
            onClick={() => this.setState({ showLicensesDialog: true })}
          >Licenses</Button>
        </div>
        <LinearProgress
          hidden={!this.props.isLoading}
          className='progressBar'
          color='primary'
        />
        <Dialog open={this.state.showErrorDialog}>
          <DialogTitle id='alert-dialog-title'>
            Error while connecting to Kafka Cluster
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {this.props.currentCluster?.state?.error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ showErrorDialog: false })}
              color='primary'
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.showLicensesDialog} scroll="paper">
          <DialogTitle>
            Third Party License
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.showLicensesDialog && this.loadLicenses()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ showLicensesDialog: false })}
              color='primary'
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles, {
  withTheme: true
})(connector(LandingPage))
