import { FinancialModelInterface } from 'interfaces/financial-model';
import { UserStartupInterface } from 'interfaces/user-startup';
import { UserInterface } from 'interfaces/user';

export interface StartupInterface {
  id?: string;
  name: string;
  owner_id: string;
  financial_model?: FinancialModelInterface[];
  user_startup?: UserStartupInterface[];
  user?: UserInterface;
  _count?: {
    financial_model?: number;
    user_startup?: number;
  };
}
