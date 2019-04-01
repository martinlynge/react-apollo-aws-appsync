import React from 'react';
import dayjs from 'dayjs';
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  withStyles,
} from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place';
import { Link } from '@reach/router';
import CardMenu from './CardMenu';
import truncate from '../utils/truncate';
import cover from '../utils/cover';

const styles = () => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
});

function Event({ data, classes }) {
  const { id, name, when, where, description } = data;

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Card className={classes.card}>
        <CardHeader
          action={<CardMenu id={id} />}
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
          <Typography variant="body1">{truncate(description, 40)}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" component={Link} to={id}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default withStyles(styles)(Event);
