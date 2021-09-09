import { ListCompletedOrderComponent } from './pages/order/list-completed-order/list-completed-order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditOrderComponent } from './pages/order/edit-order/edit-order.component';
import { LoginComponent } from './pages/login/login.component';
import { AddOrderComponent } from './pages/order/add-order/add-order.component';
import { AddOrderSucursalComponent } from './pages/order/add-order-sucursal/add-order-sucursal.component';
import { ListOrdersComponent } from './pages/order/list-orders/list-orders.component';
import { ListProductsComponent } from './pages/product/list-products/list-products.component';
import { ListProductsSucursalComponent } from './pages/product/list-products-sucursal/list-products-sucursal.component';
import { ReportComponent } from './pages/report/report.component';
import { AddComplainComponent } from './pages/complain/add-complain/add-complain.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthGuard } from './core/services/auth.guard';
import { EditProductComponent } from './pages/product/edit-product/edit-product.component';
import { CreateComboComponent } from './pages/product/create-combo/create-combo.component';
import { PrintViewComponent } from './pages/print-view/print-view.component';
import { EditComplainComponent } from './pages/complain/edit-complain/edit-complain.component';
import { ListComplainComponent } from './pages/complain/list-complain/list-complain.component';
import { EditProvinceComponent } from './pages/province/edit-province/edit-province.component';
import { EditTransportComponent } from './pages/transport/edit-transport/edit-transport.component';
import { SucursalComponent } from './pages/sucursal/sucursal.component';

const routes: Routes = [

  //-- Product --//
  { path: '', component: ListOrdersComponent},
  { path: 'list-product', component: ListProductsComponent},
  { path: 'list-product-sucursal', component: ListProductsSucursalComponent},
  { path: 'add-product', component: AddProductComponent},
  { path: 'edit-product', component: EditProductComponent},
  { path: 'create-combo', component: CreateComboComponent},
  //-- Order --//
  { path: 'orders', component: ListOrdersComponent},
  { path: 'orders-completed', component: ListCompletedOrderComponent},
  { path: 'add-order', component: AddOrderComponent},
  { path: 'add-order-sucursal', component: AddOrderSucursalComponent},
  { path: 'edit-order', component: EditOrderComponent},

  //-- Print --//
  { path: 'print-view', component: PrintViewComponent},

  //-- Complains --//
  { path: 'add-complain', component: AddComplainComponent},
  { path: 'edit-complain', component: EditComplainComponent},
  { path: 'list-complain', component: ListComplainComponent},

  //-- User Related --//
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},

  //-- Reports --//
  { path: 'reports', component: ReportComponent},

  //-- Province --//
  { path: 'edit-province', component: EditProvinceComponent},

   //-- Transport --//
   { path: 'edit-transport', component: EditTransportComponent},

   //-- Sucursal --//
   { path: 'edit-sucursal', component: SucursalComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
