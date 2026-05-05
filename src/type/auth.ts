export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface SignUpResponseData {
  userId: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: {
    userId: number;
    name: string;
    email: string;
  };
}
