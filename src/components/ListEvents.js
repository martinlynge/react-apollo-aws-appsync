import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Event from './Event';
import CreateEvent from './CreateEvent';
import Loading from './Loading';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles, Typography } from '@material-ui/core';

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

const styles = theme => ({
  wrapper: {
    padding: 24,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

const ListEvents = ({ classes }) => {
  const [isOpen, setToggle] = useState(false);

  return (
    <Query query={LIST_EVENTS}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error)
          return (
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={true}
              autoHideDuration={6000}
              message={<span id={error.name}>{error.message}</span>}
            />
          );

        return (
          <>
            {data.listEvents.items.length ? (
              <Grid container spacing={24} className={classes.wrapper}>
                <Grid item xs={12}>
                  <Grid container spacing={24}>
                    {data.listEvents.items.map(data => (
                      <Event key={data.id} data={data} />
                    ))}
                  </Grid>
                </Grid>
                <Fab
                  onClick={() => setToggle(true)}
                  color="primary"
                  aria-label="Add"
                  className={classes.fab}
                >
                  <AddIcon />
                </Fab>
              </Grid>
            ) : (
              <Grid
                container
                spacing={24}
                className={classes.wrapper}
                justify="center"
                alignItems="center"
                style={{ height: '100vh' }}
              >
                <Grid item xs={10} md={8}>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    direction="column"
                  >
                    <Typography variant="title" align="center">
                      There's no events yet
                    </Typography>
                    <Fab
                      onClick={() => setToggle(true)}
                      variant="extended"
                      color="primary"
                      aria-label="Add"
                      style={{ marginTop: 32 }}
                    >
                      <AddIcon style={{ marginRight: 8 }} />
                      Add a new event
                    </Fab>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <CreateEvent isOpen={isOpen} setToggle={setToggle} />
          </>
        );
      }}
    </Query>
  );
};

export default withStyles(styles)(ListEvents);
