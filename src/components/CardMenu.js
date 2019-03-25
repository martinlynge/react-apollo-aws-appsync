import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';
import { Link } from '@reach/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { LIST_EVENTS } from './ListEvents';

const DELETE_EVENT = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;

export default class CardMenu extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { id } = this.props;

    return (
      <>
        <IconButton onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose} component={Link} to={id}>
            Update
          </MenuItem>
          <Mutation mutation={DELETE_EVENT}>
            {deleteEvent => (
              <MenuItem
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
                  this.handleClose();
                }}
              >
                Delete
              </MenuItem>
            )}
          </Mutation>
        </Menu>
      </>
    );
  }
}
