export interface IDataLaba {
  po?: string;
  subPo?: string;
  supDate?: Date;
  supName?: string;
  buy?: number;
  poCust?: string;
  subPoCust?: string;
  custDate?: Date;
  custName?: string;
  sell?: number;
  profit?: number;
  percentage?: number;
}

export interface IOrder {
  id?: number;
  po?: string;
  sub?: string;
  poDate?: Date;
  name?: string;
  inv?: string;
  invDate?: Date;
  bill?: number;
  totBill?: number;
}

export interface IPenjualan {
  id?: number;
  po?: string;
  sub?: string;
  poCust?: string;
  poDate?: Date;
  name?: string;
  inv?: string;
  invDate?: Date;
  bill?: number;
  totBill?: number;
}
