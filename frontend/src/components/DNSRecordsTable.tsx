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
import { useDNSRecords, DNSRecord } from '../hooks/useDNSRecords';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useNotification } from '../contexts/NotificationContext';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';

interface DNSRecordsTableProps {
  zoneId: string;
}

export default function DNSRecordsTable({ zoneId }: DNSRecordsTableProps) {
  const router = useRouter();
  const [filteringText, setFilteringText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<DNSRecord[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const pageSize = 20;

  const { data, isLoading, refetch } = useDNSRecords(zoneId, filteringText, '', currentPage, pageSize);
  const { addNotification } = useNotification();

  const records = data?.data || [];
  const totalPages = data?.pagination?.total_pages || 1;

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(
        selectedItems.map(item => api.delete(`/hosted-zones/${zoneId}/records/${item.id}`))
      );
      addNotification({
        type: 'success',
        content: `Successfully deleted ${selectedItems.length} record(s).`,
      });
      setSelectedItems([]);
      setIsDeleteModalVisible(false);
      refetch();
    } catch (err) {
      console.error(err);
      addNotification({
        type: 'error',
        content: 'Failed to delete record. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = (format: string) => {
    // Assuming backend runs on 8000
    window.open(`http://localhost:8000/api/v1/hosted-zones/${zoneId}/records/export?format=${format}`, '_blank');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/hosted-zones/${zoneId}/records/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addNotification({
        type: 'success',
        content: response.data.message || 'Records imported successfully.',
      });
      refetch();
    } catch (err: any) {
      addNotification({
        type: 'error',
        content: err.response?.data?.detail || 'Failed to import zone file.',
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      {isMounted && (
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
          header="Delete DNS record(s)"
        >
          Are you sure you want to delete {selectedItems.length} selected record(s)? This action cannot be undone.
        </Modal>
      )}

      <Table
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems as DNSRecord[])}
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
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".zone,.txt" 
                onChange={handleFileUpload} 
              />
              <ButtonDropdown
                items={[
                  { id: 'json', text: 'Export as JSON' },
                  { id: 'bind', text: 'Export as BIND (.zone)' }
                ]}
                onItemClick={({ detail }) => handleExport(detail.id)}
              >
                Export zone
              </ButtonDropdown>
              <Button onClick={() => fileInputRef.current?.click()} loading={isImporting}>
                Import zone file
              </Button>
              <Button 
                disabled={selectedItems.length === 0} 
                onClick={() => setIsDeleteModalVisible(true)}
              >
                Delete record
              </Button>
              <Button 
                disabled={selectedItems.length !== 1} 
                onClick={() => router.push(`/hosted-zones/${zoneId}/edit-record/${selectedItems[0].id}`)}
              >
                Edit record
              </Button>
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
    </>
  );
}
