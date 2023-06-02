import { UserInterface } from 'interfaces/user';
import { StartupInterface } from 'interfaces/startup';

export interface UserStartupInterface {
  id?: string;
  user_id: string;
  startup_id: string;

  user?: UserInterface;
  startup?: StartupInterface;
  _count?: {};
}
