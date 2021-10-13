/* eslint-disable multiline-ternary */
import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AnyAction, applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createMuiTheme, ThemeOptions, ThemeProvider } from '@material-ui/core'
import teal from '@material-ui/core/colors/teal'
import green from '@material-ui/core/colors/green'

import rootReducer, {
  AppState,
  initialState
} from './store/reducers/root.reducer'

import 'fontsource-roboto/100.css'
import 'fontsource-roboto/300.css'
import 'fontsource-roboto/500.css'

import './App.scss'
import LandingPage from './components/landing-page/LandingPage'
import CreateCluster from './components/create-cluster/CreateCluster'
import { StorageService } from './services/storage.service'
import ClusterOverview from './components/cluster-overview/ClusterOverview'
import { ThunkDispatch } from '@reduxjs/toolkit'
import Consumer from './components/consumer/Consumer'
import Producer from './components/producer/Producer'

const mainElement = document.createElement('app-root')
document.body.appendChild(mainElement)

export type DispatchFunctionType = ThunkDispatch<AppState, undefined, AnyAction>
const persistentState = StorageService.getAs<AppState>('persistentState')
const store = createStore(
  rootReducer,
  persistentState !== undefined ? persistentState : initialState,
  applyMiddleware<DispatchFunctionType, AppState>(thunkMiddleware)
)

// Listen to store events and update the localStorage
// if either currentCluster or clusters was updated
store.subscribe(() => {
  const state = store.getState()
  StorageService.set('persistentState', {
    currentCluster: {
      name: state.currentCluster?.name,
      bootstrapServers: state.currentCluster?.bootstrapServers,
      state: {
        isAvailable: false
      }
    },
    cluster: state.cluster
  })
})

const isProduction = process.env.NODE_ENV === 'production'

// define routes for the frontend and the specific React components
const routes = [
  {
    path: '/consumer/:cluster/:topic',
    component: Consumer
  },
  {
    path: '/producer/:cluster/:topic',
    component: Producer
  },
  {
    path: '/create-cluster/:clusterName?/:bootstrapServer?',
    component: CreateCluster
  },
  {
    path: '/cluster-overview',
    component: ClusterOverview
  },
  {
    path: '/',
    component: LandingPage
  }
]

// Material Design theme options
const theme: ThemeOptions = {
  palette: {
    type: 'light',
    primary: teal,
    secondary: green
  }
}

const App = () => {
  document.title = 'QueueMT'

  return (
    <Provider store={store}>
      <ThemeProvider theme={createMuiTheme(theme)}>
        {isProduction ? (
          <HashRouter>
            <Switch>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  component={route.component}
                />
              ))}
            </Switch>
          </HashRouter>
        ) : (
          <BrowserRouter>
            <Switch>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  component={route.component}
                />
              ))}
            </Switch>
          </BrowserRouter>
        )}
      </ThemeProvider>
    </Provider>
  )
}

ReactDom.render(<App />, mainElement)
