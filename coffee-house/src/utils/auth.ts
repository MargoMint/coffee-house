const AUTH_KEY = 'isLoginned';

export function setIsLoginned(state: boolean): void {
  localStorage.setItem(AUTH_KEY, state ? 'true' : 'false');
}

export function isLoginned(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}
