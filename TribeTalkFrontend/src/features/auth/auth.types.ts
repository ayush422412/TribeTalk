export  default interface User{
    data: any;

    _id: string;
    username : string;
    email : string;
}


export default interface AuthResponse{
    user : User;
    accessToken : string;



}