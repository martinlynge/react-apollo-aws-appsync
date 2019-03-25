import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { LIST_EVENTS } from './ListEvents';
import FormFields from './FormFields';

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

export default class CreateEvent extends Component {
  state = {
    name: '',
    when: new Date().toISOString().substring(0, 19),
    where: '',
    description: '',
  };

  handleChange = this.handleChange.bind(this);
  handleClear = this.handleClear.bind(this);

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  handleClear() {
    this.setState({
      name: '',
      when: new Date().toISOString().substring(0, 19),
      where: '',
      description: '',
    });
  }

  render() {
    const { name, when, where, description } = this.state;

    return (
      <Mutation mutation={CREATE_EVENT}>
        {createEvent => (
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
              this.handleClear();
            }}
          >
            <FormFields
              formTitle="New event"
              submitLabel="Add event"
              name={name}
              when={when}
              where={where}
              description={description}
              handleChange={this.handleChange}
            />
          </form>
        )}
      </Mutation>
    );
  }
}
