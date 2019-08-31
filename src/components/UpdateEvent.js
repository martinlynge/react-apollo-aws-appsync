import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
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

function UpdateEvent(props) {
  const [state, setState] = useState({
    name: props.data.name,
    when: props.data.when,
    where: props.data.where,
    description: props.data.description,
  });

  const [updateEvent] = useMutation(UPDATE_EVENT);

  const { name, when, where, description } = state;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        const { id } = props.data;
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
        handleChange={event => {
          const { name, value } = event.target;
          setState({
            ...state,
            [name]: value,
          });
        }}
      />
    </form>
  );
}

export default UpdateEvent;
