import React from 'react';
import Client from './Client';
import { Router } from '@reach/router';
import ListEvents from './components/ListEvents';
import ViewEvent from './components/ViewEvent';

export default function App() {
  return (
    <Client>
      <Router>
        <ListEvents path="/" />
        <ViewEvent path=":eventId" />
      </Router>
    </Client>
  );
}
