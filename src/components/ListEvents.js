import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Event from './Event';
import CreateEvent from './CreateEvent';
import Loading from './Loading';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';

export const LIST_EVENTS = gql`
  query listEvents {
    listEvents {
      items {
        id
        name
        when
        where
        description
      }
    }
  }
`;

const styles = () => ({
  wrapper: {
    padding: 24,
  },
});

const ListEvents = ({ classes }) => (
  <Query query={LIST_EVENTS}>
    {({ loading, error, data }) => {
      if (loading) return <Loading />;
      if (error) return <p>Error :(</p>;

      return (
        <Grid container spacing={24} className={classes.wrapper}>
          <Grid item xs={12} md={6} lg={8}>
            <Grid container spacing={24}>
              {data.listEvents.items.map(data => (
                <Event key={data.id} data={data} />
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Grid container justify="flex-end">
              <Grid item lg={10}>
                <CreateEvent />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }}
  </Query>
);

export default withStyles(styles)(ListEvents);
