import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Pagination } from './useHostedZones';

export interface DNSRecord {
  id: string;
  hosted_zone_id: string;
  name: string;
  type: string;
  ttl: number;
  value: string;
  routing_policy: string;
  created_at: string;
  updated_at: string;
}

export interface DNSRecordsResponse {
  data: DNSRecord[];
  pagination: Pagination;
}

export function useDNSRecords(zoneId: string, search: string = '', recordType: string = '', page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: ['dns-records', zoneId, search, recordType, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (recordType) params.append('type', recordType);
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());
      
      const { data } = await api.get<DNSRecordsResponse>(`/hosted-zones/${zoneId}/records?${params.toString()}`);
      return data;
    },
    enabled: !!zoneId,
  });
}
