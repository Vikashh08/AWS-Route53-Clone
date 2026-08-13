'use client';

import * as React from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Modal from '@cloudscape-design/components/modal';
import { useHostedZones, HostedZone } from '../hooks/useHostedZones';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useNotification } from '../contexts/NotificationContext';

export default function HostedZonesTable() {
  const router = useRouter();
  const [filteringText, setFilteringText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<HostedZone[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 20;

  const { data, isLoading, isError, mutate } = useHostedZones(filteringText, currentPage, pageSize);
  const { addNotification } = useNotification();

  const zones = data?.data || [];
  const totalPages = data?.pagination?.total_pages || 1;

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;
    setIsDeleting(true);
    try {
      await api.delete(`/hosted-zones/${selectedItems[0].id}`);
      addNotification({
        type: 'success',
        content: `Hosted zone ${selectedItems[0].name} deleted successfully.`,
      });
      setSelectedItems([]);
      setIsDeleteModalVisible(false);
      mutate(); // refresh data
    } catch (err) {
      console.error(err);
      addNotification({
        type: 'error',
        content: 'Failed to delete hosted zone. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        onDismiss={() => setIsDeleteModalVisible(false)}
        visible={isDeleteModalVisible}
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setIsDeleteModalVisible(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleDelete} loading={isDeleting}>Delete</Button>
            </SpaceBetween>
          </Box>
        }
        header="Delete hosted zone"
      >
        Are you sure you want to delete the hosted zone <b>{selectedItems[0]?.name}</b>?
      </Modal>

      <Table
        selectionType="single"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems as HostedZone[])}
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
          id: 'records',
          header: 'Records',
          cell: item => item.record_count,
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
              <Button 
                disabled={selectedItems.length === 0} 
                onClick={() => setIsDeleteModalVisible(true)}
              >
                Delete zone
              </Button>
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
    </>
  );
}
