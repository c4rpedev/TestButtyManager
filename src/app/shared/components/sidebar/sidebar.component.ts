import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { ComplainService } from 'src/app/core/services/complain.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user: string;
  complains: boolean = false;
  isOpened: String;
  admin: boolean;
  sucursal: boolean;
  restaurant: boolean;
  complainsCount: number =0;
  ordersCount: number =0;
  public screenWidth: any;
  public screenHeight: any;
  albaranes: string = 'albaranes.jpg'
  
  constructor(
    private complainService: ComplainService,
    public userService: UserService,
    public auth: AuthService,
    private orderService: OrderService,
    @Inject(DOCUMENT) public document: Document) { 
    
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user =>{
      this.user = user.nickname;
      this.admin = this.userService.isAdmin(this.user);
      this.sucursal = this.userService.isSucursal(this.user);
      this.restaurant = this.userService.isRestaurant(this.user);
      this.orderService.getOrder(this.user).then(res=>{
        console.log('RESSSSS');
        for (const order of res) {
          if(order.attributes.state != 'Finalizado' && order.attributes.orderAlbaran._name.indexOf(this.albaranes, order.attributes.orderAlbaran._name.length - this.albaranes.length) !== -1){
             this.ordersCount++;
             console.log(this.ordersCount);             
          }          
        } 
        
      })
      this.complainService.getComplain(this.user).then(res=>{        
       for (const complain of res) {      
         if(complain.attributes.complainState == 'Nuevo'){
           this.complains = true;
           this.complainsCount++;
         }
       }       
     })
     }) 
     
     
    
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
   }

  openMenu(){
    if(this.screenWidth<768){
      if(this.isOpened == "block"){
        this.isOpened = "none"
      }else{
        this.isOpened = "block"
      }
    }
    
    
  }
  isComercial(): boolean{
    if(this.user == 'buttycomercial' || this.user == 'comercial' ){
      return true;
    }else{
      return false;
    }
  }

}
