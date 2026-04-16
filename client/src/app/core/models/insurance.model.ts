export interface Insurance {
  id: string;
  provider_name: string;
  policy_number: string;
  contact_number?: string;
  email?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InsuranceFilters {
  page?: number;
  per_page?: number;
  search?: string;
}
