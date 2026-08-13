'use client';

import * as React from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import { useDNSRecords } from '../hooks/useDNSRecords';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DNSRecordsTableProps {
  zoneId: string;
}

export default function DNSRecordsTable({ zoneId }: DNSRecordsTableProps) {
  const router = useRouter();
  const [filteringText, setFilteringText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useDNSRecords(zoneId, filteringText, '', currentPage, pageSize);

  const records = data?.data || [];
  const totalPages = data?.pagination?.total_pages || 1;

  return (
    <Table
      columnDefinitions={[
        {
          id: 'name',
          header: 'Record name',
          cell: item => item.name,
          sortingField: 'name',
          isRowHeader: true,
        },
        {
          id: 'type',
          header: 'Type',
          cell: item => item.type,
        },
        {
          id: 'routing_policy',
          header: 'Routing policy',
          cell: item => item.routing_policy,
        },
        {
          id: 'value',
          header: 'Value/Route traffic to',
          cell: item => item.value,
        },
        {
          id: 'ttl',
          header: 'TTL (seconds)',
          cell: item => item.ttl,
        }
      ]}
      items={records}
      loadingText="Loading records"
      loading={isLoading}
      empty={
        <Box textAlign="center" color="inherit">
          <b>No records found</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            Create a DNS record to get started.
          </Box>
          <Button onClick={() => router.push(`/hosted-zones/${zoneId}/create-record`)}>Create record</Button>
        </Box>
      }
      filter={
        <TextFilter
          filteringPlaceholder="Find records by name or value"
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
              <Button variant="primary" onClick={() => router.push(`/hosted-zones/${zoneId}/create-record`)}>Create record</Button>
            </SpaceBetween>
          }
        >
          Records
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
