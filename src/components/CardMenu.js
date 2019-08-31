import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';
import { Link } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LIST_EVENTS } from './ListEvents';

const DELETE_EVENT = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;

function CardMenu({ id }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteEvent] = useMutation(DELETE_EVENT);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to={id}>
          Update
        </MenuItem>
        <MenuItem
          disabled={id < 0}
          onClick={event => {
            event.preventDefault();
            deleteEvent({
              variables: { id },
              // We only have to account for the id in the response as
              // that is all that is required to remove the event
              // from the list
              optimisticResponse: {
                __typename: 'Mutation',
                deleteEvent: {
                  __typename: 'Event',
                  id,
                },
              },
              update: cache => {
                const data = cache.readQuery({ query: LIST_EVENTS });

                // Filter events and return new array
                // without the event that we want to remove
                data.listEvents.items = data.listEvents.items.filter(
                  item => item.id !== id
                );

                cache.writeQuery({ query: LIST_EVENTS, data });
              },
            });
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

export default CardMenu;
