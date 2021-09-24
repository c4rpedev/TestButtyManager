import { User } from './../../../core/models/user';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user: User = new User();
  mobNumberPattern = "^5+[0-9]{7}$";
  repeatpassword: any;

  constructor(public userService: UserService,
              public router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){

    console.log(form);

    if(form.valid){
      this.userService.addUser(this.userService.selectedUser);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Usuario añadido',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/list-user']);
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos obligatorios!',
      })
    }
  }

}
