import React from 'react';
import { TextField, Button, Typography, Grid } from '@material-ui/core';

export default function FormFields({
  handleChange,
  formTitle,
  submitLabel,
  name,
  when,
  where,
  description,
}) {
  return (
    <>
      {formTitle && <Typography variant="title">{formTitle}</Typography>}
      <TextField
        id="name"
        name="name"
        label="Name"
        value={name}
        onChange={handleChange}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        id="when"
        name="when"
        label="When"
        type="datetime-local"
        value={when}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        id="where"
        name="where"
        label="Where"
        value={where}
        onChange={handleChange}
        margin="normal"
        required
        fullWidth
      />
      <TextField
        id="description"
        name="description"
        label="Description"
        value={description}
        onChange={handleChange}
        margin="normal"
        multiline
        required
        fullWidth
      />
      <Grid container justify="space-between" style={{ marginTop: 16 }}>
        <Button>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {submitLabel}
        </Button>
      </Grid>
    </>
  );
}
