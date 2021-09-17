import { Product } from 'src/app/core/models/product';
import { CategoryService } from './../../../core/services/category.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  product: Product = new Product();
  admin: boolean;
  who: string;
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
  categorys: any = [];
  productState: boolean;



  constructor(private service: ProductService,
    private router: Router,
    private provinceService: GetProvincesService,
    private userService: UserService,
    private municipioService: MunicipioService,
    private categoryService: CategoryService,
    public auth: AuthService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) public document: Document

  ) {
    this.selectedCategory = null;
    this.selectedProvince = null;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {

      this.user = user.nickname;
      this.isAdmin();
      this.who = history.state.who;
      this.getProvinces();
      //this.getProductForProvince();
      this.getCategories();
      // this.migrar();
    })

  }

  getCategories() {
    this.categoryService.getCategories().then(res => {
      this.categorys = res;
    })
  }

  openDialog(product: any): void {
    const dialogRef = this.dialog.open(PreviewProductComponent, {
      width: '600px',
      data: { products: product }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }



  addOrder() {
    if (this.productsCart.length > 0) {
      this.router.navigate(['/b']);
      this.router.navigateByUrl('/add-order', { state: { product: this.productsCart, province: this.selectedProvince } });
    } else {
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
    this.router.navigateByUrl('/edit-product', { state: { product: this.productsEdit, productA: this.productsAttr } });
  };

  createCombo() {
    if (this.productsCart.length > 1) {
      this.router.navigate(['/b']);
      this.router.navigateByUrl('/create-combo', { state: { product: this.productsCart } });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Seleccione al menos 2 productos para crear un combo.',
        showConfirmButton: false,
        timer: 1500
      })
    }

  };
  getProvinces() {
    this.provincesP = this.provinceService.getProvinces();
    for (const province of this.provincesP) {
      this.municipioService.getMunicipio(province.name).then(res => {
        console.log(res[0].attributes['municipios'][0].municipio);
        if (res[0].attributes['municipios'][0].municipio != '') {
          this.provinces.push(province);
          console.log('PRovinces');
          console.log(this.provinces);
        }
      })

    }

  }

  getProductForProvince() {
    console.log(this.selectedProvince);
    if (this.userService.isAdmin(this.user)) {
      this.loading = true;
      this.service.getProductsbyProvince(this.selectedProvince).then(res => {
        this.products = res;
        this.loading = false;
        console.log('Products');

        console.log(this.products);
      })
    } else {
      this.loading = true;
      this.service.getProductsbyProvinceAndAgency(this.selectedProvince, this.user).then(res => {
        this.products = res;
        this.loading = false;
        console.log(this.products);

      })
    }
  }
  isAdmin() {
    this.admin = this.userService.isAdmin(this.user);
  }
  addToCart(product: any) {
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
  changeState(id: string, state: boolean) {
    console.log('Changed');
    console.log(id);
    console.log(state);

    this.service.updateProductState(id, !state);

  }



  //MIGRATE
  migrar() {
    this.service.migrate().then(res => {
      for (let index = 0; index < res.length; index++) {
        let agency = [];
        let province = [];
        const element = res[index];
        console.log(element.attributes.province);
        console.log(index)


        if (element.attributes.productAgency != null) {
          agency.push(element.attributes.productAgency)
        } else {
          agency.push('Todas');
        }
        if (element.attributes.province == "Occidente") {
          province.push('Matanzas');
          province.push('Cienfuegos');
          province.push('Villa Clara');
          province.push('Mayabeque');
          province.push('La Habana');
          province.push('Artemisa');
          province.push('Sancti Spíritus');
        } else {
          if (element.attributes.province == "Oriente") {
            province.push('Las Tunas');
            province.push('Granma');
            province.push('Holguín');
          } else {
            province.push(element.attributes.province);
          }
        }

        this.service.updateP(element.id, agency, province)
      }
    })
  }

}
