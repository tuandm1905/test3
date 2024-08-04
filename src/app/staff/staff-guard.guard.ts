import { CanActivateFn } from '@angular/router';
const getItem = (key: any) => {
  let data = localStorage.getItem(key);
  return data;
}
export const staffGuardGuard: CanActivateFn = (route, state) => {
  let dataType: string = getItem('userType') || '';
  let token = getItem('token');
  if (!(dataType?.toLowerCase() == 'staff' && token)) {
    window.location.href = '/staff/auth/login'
  }
  return true;
};
