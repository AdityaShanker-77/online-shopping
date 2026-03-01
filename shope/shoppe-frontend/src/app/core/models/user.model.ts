export interface User {
  id: number;
  email: string;
  roles: string[];
}

export interface JwtResponse {
  token: string;
  id: number;
  email: string;
  roles: string[];
}
