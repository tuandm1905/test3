import { CanActivateFn } from '@angular/router';
const getItem = (key: any) => {
	let data = localStorage.getItem(key);
	return data ;
}
export const ownerGuardGuard: CanActivateFn = (route, state) => {
	let dataType: string = getItem('userType') || '';
	let token = getItem('token');
	if(!(dataType?.toLowerCase() == 'owner' && token)) {
		window.location.href = '/owner/auth/login'
	}
	return true
};
