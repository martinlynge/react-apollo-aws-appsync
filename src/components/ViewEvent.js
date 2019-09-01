import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import UpdateEvent from './UpdateEvent';
import Loading from './Loading';
import cover from '../utils/cover';
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  withStyles,
  Grid,
  Container,
  Divider,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fab,
  TextField,
} from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place';
import EditIcon from '@material-ui/icons/Edit';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const GET_EVENT = gql`
  query getEvent($id: ID!) {
    getEvent(id: $id) {
      id
      name
      when
      where
      description
      comments {
        items {
          commentId
          content
          createdAt
        }
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation addComment($id: ID!, $content: String!, $createdAt: String!) {
    commentOnEvent(eventId: $id, content: $content, createdAt: $createdAt) {
      eventId
      commentId
      content
      createdAt
    }
  }
`;

const styles = theme => ({
  wrapper: {
    backgroundColor: '#fff',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});

function ViewEvent({ eventId, classes }) {
  const [isOpen, setToggle] = useState(false);

  const [comment, setComment] = useState('');

  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id: eventId },
    pollInterval: 500,
  });

  const [addComment] = useMutation(ADD_COMMENT);

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  // extend with plugin
  dayjs.extend(relativeTime);

  const { id, name, when, where, description, comments } = data.getEvent;

  return (
    <>
      <div className={classes.wrapper}>
        <Container maxWidth="md">
          <Card elevation={0}>
            <CardHeader
              title={name}
              subheader={dayjs(when).format('ddd, MMM D, YYYY HH:mm')}
            />
            <CardMedia className={classes.media} image={cover(name)} />
            <CardContent>
              <Grid container alignItems="center" style={{ marginBottom: 16 }}>
                <PlaceIcon
                  color="action"
                  fontSize="small"
                  style={{ marginLeft: -4, marginRight: 4 }}
                />
                <Typography variant="body2">{where}</Typography>
              </Grid>
              <Typography variant="body1">{description}</Typography>
            </CardContent>
          </Card>
          <Divider />
          {comments.items.map(item => (
            <ListItem alignItems="flex-start" key={item.commentId}>
              <ListItemAvatar>
                <Avatar alt={item.content} />
              </ListItemAvatar>
              <ListItemText
                primary={item.content}
                secondary={dayjs().to(dayjs(item.createdAt), false)}
              />
            </ListItem>
          ))}
          <form
            onSubmit={event => {
              event.preventDefault();
              addComment({
                variables: {
                  id,
                  content: comment,
                  createdAt: new Date().toISOString(),
                },
                optimisticResponse: {
                  __typename: 'Mutation',
                  commentOnEvent: {
                    __typename: 'Comment',
                    eventId: id,
                    commentId: Math.round(Math.random() * -100000).toString(),
                    content: comment,
                    createdAt: new Date().toISOString(),
                  },
                },
                update: (cache, { data: { commentOnEvent } }) => {
                  // We read event from the cache with event id
                  const data = cache.readQuery({
                    query: GET_EVENT,
                    variables: { id: eventId },
                  });

                  // Add the new comment on event to the comments items
                  data.getEvent.comments.items.unshift(commentOnEvent);

                  // Write the data to the cache
                  cache.writeQuery({
                    query: GET_EVENT,
                    variables: { id: eventId },
                    data,
                  });
                },
              });
              setComment('');
            }}
            style={{ paddingBottom: 96 }}
          >
            <TextField
              id="comment"
              name="comment"
              label="Comment"
              variant="filled"
              value={comment}
              onChange={event => setComment(event.target.value)}
              margin="normal"
              fullWidth
            />
          </form>
        </Container>
      </div>
      <Fab
        onClick={() => setToggle(true)}
        color="secondary"
        aria-label="edit"
        className={classes.fab}
      >
        <EditIcon />
      </Fab>
      <UpdateEvent isOpen={isOpen} setToggle={setToggle} data={data.getEvent} />
    </>
  );
}

export default withStyles(styles)(ViewEvent);
