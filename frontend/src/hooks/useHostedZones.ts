import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface HostedZone {
  id: string;
  name: string;
  zone_type: string;
  comment?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: int;
  page_size: int;
  total: int;
  total_pages: int;
}

export interface HostedZonesResponse {
  data: HostedZone[];
  pagination: Pagination;
}

export function useHostedZones(search: string = '', page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: ['hosted-zones', search, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('page_size', pageSize.toString());
      
      const { data } = await api.get<HostedZonesResponse>(`/hosted-zones?${params.toString()}`);
      return data;
    },
  });
}
