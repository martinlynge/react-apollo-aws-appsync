import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import FormFields from './FormFields';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

const UPDATE_EVENT = gql`
  mutation updateEvent(
    $id: ID!
    $name: String!
    $when: String!
    $where: String!
    $description: String!
  ) {
    updateEvent(
      id: $id
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

function UpdateEvent({ data, setToggle, isOpen }) {
  const [state, setState] = useState({
    name: data.name,
    when: data.when,
    where: data.where,
    description: data.description,
  });

  const [updateEvent] = useMutation(UPDATE_EVENT);

  function handleClose() {
    setToggle(false);
  }

  function isDisabled() {
    const { name, when, where, description } = state;

    return !(!!name && !!when && !!where && !!description);
  }

  const { name, when, where, description } = state;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Update event</DialogTitle>
      <form
        onSubmit={event => {
          event.preventDefault();
          const { id } = data;
          // If the id from the query and mutation results match up
          // the cache and UI is updated automatically
          updateEvent({
            variables: { id, name, when, where, description },
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
            handleChange={event => {
              const { name, value } = event.target;
              setState({
                ...state,
                [name]: value,
              });
            }}
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
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UpdateEvent;
