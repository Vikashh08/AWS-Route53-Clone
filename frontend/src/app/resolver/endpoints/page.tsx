'use client';

import * as React from 'react';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function EndpointsPage() {
  return (
    <div style={{ padding: '24px' }}>
      <SpaceBetween size="l">
        <Header variant="h1">Endpoints</Header>
        <Container>
          <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
            <Box variant="h2">Coming Soon</Box>
            <Box variant="p" color="text-body-secondary" margin={{ top: 's' }}>
              This feature is not available in this clone yet.
            </Box>
          </Box>
        </Container>
      </SpaceBetween>
    </div>
  );
}
