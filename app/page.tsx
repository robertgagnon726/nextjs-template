'use client';

import { PersistentDrawerLeft } from '@Connected-components/PersistentDrawerLeft';
import { Main } from '@Components/Main';

/**
 * The main component for the application home page.
 * It handles user role-based redirection and renders the main layout.
 */
function AppHome() {
  return (
    <PersistentDrawerLeft>
      <Main />
    </PersistentDrawerLeft>
  );
}

export default AppHome;
