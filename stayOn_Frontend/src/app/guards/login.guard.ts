import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const loginGuard = (): boolean => {
  const router = inject(Router);
  const token = String(localStorage.getItem('token'));

  if (token && !tokenIsExpired(token)) {
    return true;
  } else {
    localStorage.clear();
    router.navigate(['login']);
    return false;
  }
};

const tokenIsExpired = (token: string): boolean => {
  const decoded: JwtPayload = jwtDecode(token);
  const isExpired = decoded.exp! * 1000 < Date.now();
  return isExpired;
};

export const loginStatus = (): boolean => {
  if (localStorage.getItem('token')) {
    return true;
  } else {
    return false;
  }
};
