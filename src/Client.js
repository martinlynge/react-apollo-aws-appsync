import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import config from './aws-exports';

const client = new ApolloClient({
  uri: config.aws_appsync_graphqlEndpoint,
  request: async operation => {
    operation.setContext({
      headers: {
        'x-api-key': config.aws_appsync_apiKey,
      },
    });
  },
});

export default function Client({ children }) {
  // The ApolloProvider is similar to React’s context provider.
  // It wraps your React app and places the client on the context,
  // which allows you to access it from anywhere in your component tree.
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
