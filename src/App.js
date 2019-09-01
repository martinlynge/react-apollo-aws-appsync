import React from 'react';
import Client from './Client';
import { Router, Link, Match } from '@reach/router';
import ListEvents from './components/ListEvents';
import ViewEvent from './components/ViewEvent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { IconButton } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';

export default function App() {
  return (
    <Client>
      <AppBar position="static" color="primary">
        <Toolbar variant="dense">
          <Match path="/:id">
            {props =>
              props.match ? (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  component={Link}
                  to="/"
                >
                  <ArrowBack />
                </IconButton>
              ) : null
            }
          </Match>
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
