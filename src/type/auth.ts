export interface User {
  id: number;
  email: string;
  name: string;
}

export interface SignUpRequest extends User {
  password: string;
  passwordConfirm: string;
}

export interface SignUpResponseData extends Omit<User, "password"> {
  name: string;
}

export interface LoginRequest extends Omit<User, "id" & "name"> {
  password: string;
}
