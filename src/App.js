import React from 'react';
import Client from './Client';
import { Router } from '@reach/router';
import ListEvents from './components/ListEvents';
import ViewEvent from './components/ViewEvent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function App() {
  return (
    <Client>
      <AppBar position="static" color="primary">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            Events
          </Typography>
        </Toolbar>
      </AppBar>
      <Router>
        <ListEvents path="/" />
        <ViewEvent path=":eventId" />
      </Router>
    </Client>
  );
}
