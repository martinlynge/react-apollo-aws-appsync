import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
      }}
    >
      <CircularProgress />
    </div>
  );
}
