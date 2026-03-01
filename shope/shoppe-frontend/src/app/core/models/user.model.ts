export interface User {
  id: number;
  name?: string;
  email: string;
  roles: string[];
}

export interface JwtResponse {
  token: string;
  id: number;
  name?: string;
  email: string;
  roles: string[];
}
