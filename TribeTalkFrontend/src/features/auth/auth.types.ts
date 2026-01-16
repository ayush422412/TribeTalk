// features/auth/auth.types.ts
export default interface User {
  _id: string
  username: string
  email: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}


export default interface AuthResponse{
    user : User;
    accessToken : string;



}

