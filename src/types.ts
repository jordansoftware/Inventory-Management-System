export type ProductType = string;

export type RAMType = 'Non-ECC' | 'ECC';
export type RAMMemoryType = 'UDIMM' | 'RDIMM' | 'LRDIMM' | 'SO-DIMM' | 'Standard';
export type RAMRank = '1Rx4' | '1Rx8' | '1Rx16' | '2Rx4' | '2Rx8' | '4Rx4';

export interface RAMAttributes {
  ramType: RAMType;
  memoryType: RAMMemoryType;
  rank?: RAMRank;
  brand: string;
  frequency: string;
  model: string;
  capacity: string;
}

export interface CPUAttributes {
  brand: string;
  socket: string;
  generation: string;
  ramType: string;
  model: string;
}

export interface ProductAttribute {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'ram-wizard';
  options?: string[];
  placeholder?: string;
}

export interface ProductDefinition {
  type: ProductType;
  attributes: ProductAttribute[];
}

export interface InventoryItem {
  id: string;
  type: ProductType;
  attributes: Record<string, string | number>;
  quantity: number;
  location: string;
  timestamp: number;
  addedBy: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  channel: string;
  attachments?: string[];
}

export type UserRole = 'Admin' | 'Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: number;
}
