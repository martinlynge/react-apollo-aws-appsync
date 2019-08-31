import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LIST_EVENTS } from './ListEvents';
import FormFields from './FormFields';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const CREATE_EVENT = gql`
  mutation createEvent(
    $name: String!
    $when: String!
    $where: String!
    $description: String!
  ) {
    createEvent(
      name: $name
      when: $when
      where: $where
      description: $description
    ) {
      id
      name
      when
      where
      description
    }
  }
`;

const now = () => new Date().toISOString().substring(0, 19);

function CreateEvent(props) {
  const [state, setState] = useState({
    name: '',
    when: now(),
    where: '',
    description: '',
  });

  const [createEvent] = useMutation(CREATE_EVENT);

  function handleChange(event) {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value,
    });
  }

  function handleClear() {
    setState({
      name: '',
      when: now(),
      where: '',
      description: '',
    });
  }

  function handleClose() {
    props.setToggle(false);
    handleClear();
  }

  function isDisabled() {
    const { name, when, where, description } = state;

    return !(!!name && !!when && !!where && !!description);
  }

  const { name, when, where, description } = state;

  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">New event</DialogTitle>
      <form
        onSubmit={event => {
          event.preventDefault();
          createEvent({
            // The create event mutation adds a new event to the cache
            // but the cache ROOT_QUERY listEvents items are not updated
            // unless we update the cache manually in response to the mutation
            // or use the refetchQueries function which is the simplest approach
            // but requires a new network request for every query
            // you want to refetch after the mutation
            variables: { name, when, where, description },
            // The update function will be called twice.
            // Firstly with the optimistic response, and
            // secondly with the mutation result
            optimisticResponse: {
              __typename: 'Mutation',
              createEvent: {
                __typename: 'Event',
                // We assign a temporary id. The server responds with the real id.
                id: Math.round(Math.random() * -100000).toString(),
                name,
                when,
                where,
                description,
              },
            },
            // The update function can either be passed
            // as a prop to the mutation component
            // or as an option to the mutate function
            // I would recommend to pass it as an option to
            // the mutation function if you plan to implement optimistic UI.
            // Without the optimistic response we will
            // have to wait for the mutation response
            // before we can update the cache.
            update: (cache, { data: { createEvent } }) => {
              // We read thee query LIST_EVENTS from the cache
              const data = cache.readQuery({ query: LIST_EVENTS });

              // We add the result of the newly created event
              data.listEvents.items.unshift(createEvent);

              // We write data to the cached LIST_EVENTS query.
              // Any subscriber to the apollo client cache will instantly update
              cache.writeQuery({ query: LIST_EVENTS, data });
            },
          });
          handleClose();
        }}
      >
        <DialogContent>
          <FormFields
            name={name}
            when={when}
            where={where}
            description={description}
            handleChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isDisabled()}
          >
            Add event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateEvent;
