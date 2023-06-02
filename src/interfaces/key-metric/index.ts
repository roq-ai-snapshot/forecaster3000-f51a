import { FinancialModelInterface } from 'interfaces/financial-model';

export interface KeyMetricInterface {
  id?: string;
  financial_model_id: string;
  name: string;
  value: number;

  financial_model?: FinancialModelInterface;
  _count?: {};
}
