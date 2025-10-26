export function validateLogin(value: string): string | null {
  if (value.length < 3) return 'Login must be at least 3 characters';
  if (!/^[A-Za-z][A-Za-z]*$/.test(value))
    return 'Login must start with a letter and contain only letters';
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length < 6) return 'Password must be at least 6 characters';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
    return 'Password must contain at least one special character';
  return null;
}
