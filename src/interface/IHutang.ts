export interface IHutang {
  id?: number;
  po?: string;
  sub?: string;
  poDate?: string;
  name?: string;
  inv?: string;
  invDate?: string;
  rangeDay?: string;
  dueDate?: string;
  overDue?: string;
  bill?: number;
  billRemaning?: number;
  payment?: number;
  paymentDate?: string;
  status?: string;
  billingStatus?: string;
}

export interface IHutangFilter {
  sortBy?: string;
  status?: number;
  startDate?: Date;
  endDate?: Date;
  suppName?: string[];
}
