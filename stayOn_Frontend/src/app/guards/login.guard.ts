import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const loginGuard = (): boolean => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    localStorage.clear();
    router.navigate(['login']);
    return false;
  }

  if (tokenIsExpired(token)) {
    localStorage.clear();
    router.navigate(['login']);
    return false;
  }
  return true;
};

const tokenIsExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode(token);

    if (!decoded.exp) return true;

    const isExpired = decoded.exp * 1000 < Date.now();
    return isExpired;
  } catch (error) {
    return true;
  }
};

export const loginStatus = (): boolean => {
  if (localStorage.getItem('token')) {
    return true;
  } else {
    return false;
  }
};
