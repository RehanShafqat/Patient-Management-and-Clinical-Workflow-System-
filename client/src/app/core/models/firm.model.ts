export interface Firm {
  id: string;
  firm_name: string;
  address: string;
  contact_person: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FirmFilters {
  page?: number;
  per_page?: number;
  search?: string;
}
