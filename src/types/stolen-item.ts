export type ItemStatus = 'stolen' | 'found' | 'resolved';

export interface ItemUpdate {
  date: Date;
  text: string;
  status: ItemStatus;
}

export interface StolenItem {
  id: string;
  description: string;
  shipper?: string;  // Optional for non-package items
  dateReported: Date;
  lastSeen?: Date;
  location: string;
  status: ItemStatus;
  type: 'package' | 'clothing' | 'other';
  contactInfo?: string;  // Optional contact info for the person reporting
  additionalDetails?: string;
  updates?: {
    date: Date;
    text: string;
    status?: ItemStatus;
  }[];
}

export interface StolenItemFormData {
  description: string;
  shipper?: string;
  lastSeen?: Date;
  location: string;
  type: 'package' | 'clothing' | 'other';
  contactInfo?: string;
  additionalDetails?: string;
}
