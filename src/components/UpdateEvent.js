import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FormFields from './FormFields';

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

export default class UpdateEvent extends Component {
  state = {
    name: this.props.data.name,
    when: this.props.data.when,
    where: this.props.data.where,
    description: this.props.data.description,
  };

  handleChange = this.handleChange.bind(this);

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const { name, when, where, description } = this.state;

    return (
      <Mutation mutation={UPDATE_EVENT}>
        {updateEvent => (
          <form
            onSubmit={event => {
              event.preventDefault();
              const { id } = this.props.data;
              // If the id from the query and mutation results match up
              // the cache and UI is updated automatically
              updateEvent({
                variables: { id, name, when, where, description },
              });
            }}
          >
            <FormFields
              submitLabel="Update event"
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
