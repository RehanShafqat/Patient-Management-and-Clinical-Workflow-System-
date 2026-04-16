export interface Insurance {
  id: string;
  insurance_name: string;
  insurance_code: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InsuranceFilters {
  page?: number;
  per_page?: number;
  search?: string;
}
