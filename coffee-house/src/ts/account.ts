import { isLoginned } from '../utils/auth';
import { getProfile } from './api';
import { handleLogout } from '../utils/handle-logout';

export async function initUserProfile(): Promise<void> {
  const userAccount = document.getElementById('account');
  const accountIcon = document.getElementById('account-icon');
  const userAccountName = document.getElementById('account-name');
  const logoutBtn = document.getElementById('logout-btn');
  const accountDropdown = document.getElementById('account-dropdown');

  if (!userAccount || !accountIcon || !userAccountName || !logoutBtn || !accountDropdown) return;

  if (!isLoginned()) {
    userAccount.classList.add('hidden');
    return;
  }

  const profile = await getProfile();
  const userName = profile?.login ?? 'User';
  userAccountName.textContent = `Hello, ${userName}`;
  userAccount.classList.remove('hidden');

  accountIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    accountDropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    accountDropdown.classList.remove('active');
  });

  logoutBtn.addEventListener('click', handleLogout);
}
