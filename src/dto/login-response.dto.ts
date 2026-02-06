export class LoginResponseDto {
  accessToken: string;
  user: {
    email: string;
    role: string;
  };
}