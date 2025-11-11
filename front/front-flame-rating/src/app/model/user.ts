export class User {
  idUser?: undefined;
  username: string;
  email: string;
  password?: string; 
  isAdmin: boolean;

  constructor(
    idUser: undefined, 
    username: string, 
    email: string, 
    isAdmin: boolean,
    password?: string 
  ) {
    this.idUser = idUser;
    this.username = username;
    this.email = email;
    this.isAdmin = isAdmin;
    this.password = password; 
  }
}