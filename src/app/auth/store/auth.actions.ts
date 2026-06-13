import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserProfile } from '../models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login Flow
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ token: string }>(),
    'Login Failure': props<{ error: string }>(),
    
    // Profile Fetch
    'Fetch Profile': emptyProps(),
    'Fetch Profile Success': props<{ user: UserProfile }>(),
    'Fetch Profile Failure': props<{ error: string }>(),
    
    // Auto Login (Start-up Restore)
    'Auto Login': emptyProps(),
    'Auto Login Success': props<{ token: string; user: UserProfile }>(),
    'Auto Login Failure': emptyProps(),
    
    // Logout Flow
    'Logout': emptyProps()
  }
});
