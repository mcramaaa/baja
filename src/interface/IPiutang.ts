export interface IPiutang {
  id?: number;
  po?: string;
  sub?: string;
  poDate?: string;
  name?: string;
  sj?: string;
  sjDate?: string;
  inv?: string;
  invDate?: string;
  rangeDay?: string;
  dueDate?: string;
  overDue?: string;
  bill?: number;
  billRemaning?: number;
  payment?: number;
  status?: string;
  billingStatus?: string;
}

export interface IPiutangFilter {
  sortBy?: string;
  status?: number;
  startDate?: Date;
  endDate?: Date;
  custName?: string[];
}
