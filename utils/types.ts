
import { TextProps, TextStyle } from "react-native";

export interface statCardProps {
  title: string;
  value: number | string;
  icon?: string;
  color?: string;
  onPress?: () => void;
}

export interface quickActionProps {
  icon: string;
  label?: string;
  color?: string;
  onPress?: () => void;
}

export type TypoProps = {
  style?: TextStyle;
  color?: string;
  size?: number;
  fontWeight?: TextStyle["fontWeight"];
  children: React.ReactNode;
  textProps?: TextProps;
};

export type User = {
  id: string,
  name: string,
  phone?: string,
  email: string
}

// src/types/bike.types.ts
export interface Bike {
  _id: string;
  brand: string;
  model: string;
  color: string;
  engineCC: number;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  status: 'IN_STOCK' | 'SOLD';
  createdAt?: string;
  updatedAt?: string;
}

export interface BikeFormData {
  model: string;
  color: string;
  engineCC: string;
  purchasePrice: string;
  sellingPrice: string;
  stock: string;
  status: 'IN_STOCK' | 'SOLD';
}

export interface BikeCardProps {
  bike: Bike;
  onEdit: (bike: Bike) => void;
  onDelete: (id: string) => void;
}

export interface BikeFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (bikeData: Omit<Bike, '_id' | 'brand' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Bike | null;
}