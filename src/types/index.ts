import { Role } from "@prisma/client";

export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "bestselling";
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: unknown[];
  topProducts: unknown[];
  revenueByMonth: { month: string; revenue: number }[];
}

export type UserRole = Role;
