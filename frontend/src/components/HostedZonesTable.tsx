'use client';

import * as React from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import { useHostedZones, HostedZone } from '../hooks/useHostedZones';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HostedZonesTable() {
  const router = useRouter();
  const [filteringText, setFilteringText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, isError } = useHostedZones(filteringText, currentPage, pageSize);

  const zones = data?.data || [];
  const totalPages = data?.pagination?.total_pages || 1;

  return (
    <Table
      columnDefinitions={[
        {
          id: 'name',
          header: 'Domain name',
          cell: item => <a href={`/hosted-zones/${item.id}`}>{item.name}</a>,
          sortingField: 'name',
          isRowHeader: true,
        },
        {
          id: 'type',
          header: 'Type',
          cell: item => item.zone_type,
        },
        {
          id: 'comment',
          header: 'Description',
          cell: item => item.comment || '-',
        }
      ]}
      items={zones}
      loadingText="Loading resources"
      loading={isLoading}
      empty={
        <Box textAlign="center" color="inherit">
          <b>No hosted zones</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            You don't have any hosted zones yet.
          </Box>
          <Button onClick={() => router.push('/hosted-zones/create')}>Create hosted zone</Button>
        </Box>
      }
      filter={
        <TextFilter
          filteringPlaceholder="Find hosted zones"
          filteringText={filteringText}
          onChange={({ detail }) => {
            setFilteringText(detail.filteringText);
            setCurrentPage(1);
          }}
        />
      }
      header={
        <Header
          counter={data?.pagination ? `(${data.pagination.total})` : ''}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={() => router.push('/hosted-zones/create')}>Create hosted zone</Button>
            </SpaceBetween>
          }
        >
          Hosted zones
        </Header>
      }
      pagination={
        <Pagination 
          currentPageIndex={currentPage} 
          pagesCount={totalPages} 
          onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
        />
      }
    />
  );
}
