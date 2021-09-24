import { AuthServices } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { User } from './../models/user';
import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: string;
  selectedUser: User;
  clave = 'encryptClave';

  constructor(private auth: AuthServices, private router: Router) {
    this.selectedUser = new User();
    if (this.auth.logedUser) {
      this.user = this.auth.logedUser.userName;
    }
  }

  //Nuevos Métodos

  getUsers() {
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    return query.find();
  }

  getUserbyEmail(email: string) {
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('emailId', email);
    return query.find();
  }

  async addUser(user: User) {
    // const userfind = Parse.Object.extend('users');
    // const query = new Parse.Query(userfind);
    // query.equalTo('emailId', user.emailId);
    // const us = query.find();
    // console.log('VIENE US!!!!')
    // console.log(us)
    // if(us){
    //   console.log('Ya existe un usuario con ese Correo.');
    //   return 'Error'
    // }
    const EncryptPassword = CryptoJS.AES.encrypt(user.password.trim(), this.clave.trim()).toString();

    const myNewObject = new Parse.Object('users');
    myNewObject.set('userName', user.userName);
    myNewObject.set('emailId', user.emailId);
    myNewObject.set('password', EncryptPassword);
    myNewObject.set('phoneNumber', user.phoneNumber);
    myNewObject.set('userRole', 'usuario');
    myNewObject.set('active', true);
    try {
      const result = await myNewObject.save().then(res => {
        console.log('User created', res);
        this.router.navigate(['/list-user']);
      });
    } catch (error) {
      console.error('Error while creating User: ', error);
    }
  }

  async editUser(id: string) {
    const query = new Parse.Query('users');
    try {
      const object = await query.get(id);
      try {
        const response = await object.destroy()
        return response;
      } catch (error) {
        console.error('Error while deleting ParseObject', error);
        return error;
      }
    } catch (error) {
      console.error('Error while retrieving ParseObject', error);
      return error;
    }
  }

  async deleteUser(id: string) {
    const query = new Parse.Query('users');
    try {
      // here you put the objectId that you want to delete
      const object = await query.get(id);
      try {
        return await object.destroy();
      } catch (error) {
        console.error('Error while deleting ParseObject', error);
      }
    } catch (error) {
      console.error('Error while retrieving ParseObject', error);
    }
  }








  //Métodos antiguos

  get getUser() {
    return this.user;
  }

  isAdmin(user: string): boolean {
    if (user == 'buttymanager' || user == 'buttycomercial' || user == 'buttyoperaciones' || user == 'buttyekonomico' || user == 'comercial') {
      return true;
    } else {
      return false;
    }
  }

  isSucursal(user: string): boolean {

    if (user == 'sucursalhol' || user == 'sucursalstgo' || user == 'sucursalhab' || user == 'sucursalmtz' || user == 'santamarta') {
      return true;
    } else {
      return false;
    }
  }
  isRestaurant(user: string): boolean {
    if (user == 'restaurante1' || user == 'masterpizza') {
      return true;
    } else {
      return false;
    }
  }
  returnMail(user: string): string {
    if (user == 'destinocuba') {
      return 'tonet@destinocubaagency.com';
    }
    if (user == 'buttymaster') {
      return 'elikeen910911@gmail.com';
    }
    if (user == 'villarejo') {
      return 'carlosrv1218@gmail.com';
    }
    if (user == 'tushoponline') {
      return 'contacto@tsotienda.com';
    }
    if (user == 'raiko') {
      return 'bellomichel12@gmail.com';
    }
    if (user == 'esencialpack') {
      return 'p.oriente@gmail.com';
    }
    else {
      return 'false';
    }
  }

}
