import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { PreviewProductComponent } from '../preview-product/preview-product.component';
import { StatesService } from 'src/app/core/services/states.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  admin: boolean;
  who:string;
  products: Array<any>;
  productsEdit: Array<any> = [];
  productsAttr: Array<any> = [];
  productsCart: Array<any> = [];
  provinces: any = [];
  provincesP: any;
  selectedProvince: null;
  selectedCategory: null;
  img: String;
  user: string;
  term: string;
  loading: boolean;
  categorys: any = ['Combo', 'Producto', 'restaurante1', 'masterpizza', 'combos todo x 1 precio' ];
  productState: boolean; 
  
  

  constructor(private service: ProductService,
    private router: Router,
    private provinceService: GetProvincesService,
    private userService: UserService,
    private municipioService: MunicipioService,
    public auth: AuthService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) public document: Document
   
    ) {
      this.selectedCategory = null;
      this.selectedProvince = null;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
     this.auth.user$.subscribe(user =>{
      
       this.user = user.nickname;    
       this.isAdmin();        
      this.who= history.state.who;       
      this.getProvinces();
      //this.getProductForProvince();  
    })

  }
  
  openDialog(product: any): void {
    const dialogRef = this.dialog.open(PreviewProductComponent, {
      width: '600px',
      data: {products: product}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     
    });
  }



  addOrder() {    
    if(this.productsCart.length > 0){
      this.router.navigate(['/b']);
    this.router.navigateByUrl('/add-order', { state: {product: this.productsCart, province: this.selectedProvince}});
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Seleccione al menos 1 productos para crear un pedido.',
        showConfirmButton: false,
        timer: 1500
      })
    }
      
  };

  editProduct(product: any, productsA: any) {    
    this.productsEdit.push(product);
    this.productsAttr.push(productsA);
    this.router.navigate(['/b']);
    this.router.navigateByUrl('/edit-product', { state: {product: this.productsEdit, productA: this.productsAttr}});  
  };

  createCombo() {    
    if(this.productsCart.length > 1){
      this.router.navigate(['/b']);
      this.router.navigateByUrl('/create-combo', { state: {product: this.productsCart}}); 
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Seleccione al menos 2 productos para crear un combo.',
        showConfirmButton: false,
        timer: 1500
      })
    }
     
  };
  getProvinces(){
    this.provincesP = this.provinceService.getProvinces();  
    for (const province of this.provincesP) {
      this.municipioService.getMunicipio(province.name).then(res=>{
        console.log(res[0].attributes['municipios'][0].municipio);        
        if(res[0].attributes['municipios'][0].municipio != ''){
          this.provinces.push(province);
          console.log('PRovinces');
          console.log(this.provinces);
        }
      })
  
    }
   
  }

  getProductForProvince() {
    console.log(this.selectedProvince);  
    if(this.userService.isAdmin(this.user)){
      this.loading = true;
      this.service.getAllProductProperties(this.selectedProvince).then(res=>{
        this.products = res; 
        this.loading = false;
        console.log('Products');
        
        console.log(this.products);        
      }) 
    }else{
      this.loading = true;
      this.service.getProductProperties(this.selectedProvince, this.user).then(res=>{
        this.products = res; 
        this.loading = false;
        console.log(this.products);
        
      }) 
    }  
  }
  isAdmin(){
    this.admin = this.userService.isAdmin(this.user);
  }
  addToCart(product: any){
    Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Producto añadido',
    showConfirmButton: false,
    timer: 1500
  })
    console.log(product);
    this.productsCart.push(product);
    console.log(this.productsCart);
  }
  changeState(id: string, state: boolean){
    console.log('Changed');
    console.log(id);
    console.log(state);
    
   this.service.updateProductState(id, !state);
    
  }

}
