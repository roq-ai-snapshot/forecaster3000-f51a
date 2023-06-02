import { KeyMetricInterface } from 'interfaces/key-metric';
import { StartupInterface } from 'interfaces/startup';

export interface FinancialModelInterface {
  id?: string;
  startup_id: string;
  created_at: Date;
  updated_at: Date;
  key_metric?: KeyMetricInterface[];
  startup?: StartupInterface;
  _count?: {
    key_metric?: number;
  };
}
