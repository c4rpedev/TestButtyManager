import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import * as Parse from 'parse'


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  createOrder(order: Order, products: any[], user: string){
    (async () => {
      const myNewObject = new Parse.Object('order');
      myNewObject.set('orderId', order.orderId);
      myNewObject.set('orderClientName', order.orderClientName);
      myNewObject.set('orderRecieverName', order.orderRecieverName);
      myNewObject.set('orderProvince', order.orderProvince);
      myNewObject.set('orderMunicipio', order.orderMunicipio);
      myNewObject.set('orderAddress', order.orderAddress);
      myNewObject.set('orderPhone', order.orderPhone);
      myNewObject.set('orderMobile', order.orderMobile);
      myNewObject.set('orderPrice', order.orderPrice);
      myNewObject.set('orderReference', order.orderReference);
      myNewObject.set('orderNote', order.orderNote);
      if(order.orderProvince == "Pinar del Río" || 
      order.orderProvince == "Matanzas" || 
      order.orderProvince == "Artemisa" || 
      order.orderProvince == "Cienfuegos" || 
      order.orderProvince == "Sancti Spíritus" || 
      order.orderProvince == "La Habana" || 
      order.orderProvince == "Ciego de Ávila" ||
      order.orderProvince == "Villa Clara" || 
      order.orderProvince == "Mayabeque" || 
      order.orderProvince == "Camagüey" ||
      order.orderProvince == "Isla de la Juventud"){
        myNewObject.set('orderDays', 5);
      }else{
        myNewObject.set('orderDays', 7);
      }
      myNewObject.set('productArray', products);
      myNewObject.set('orderAgency', user);
      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('order created', result);
      } catch (error) {
        console.error('Error while creating order: ', error);
      }
    })();
  }

  createOrderPatugente(order: Order, url: string [], user: string){
    (async () => {
      const myNewObject = new Parse.Object('order');
      myNewObject.set('orderId', order.orderId);
      myNewObject.set('orderClientName', order.orderClientName);
      myNewObject.set('orderRecieverName', order.orderRecieverName);
      myNewObject.set('orderProvince', order.orderProvince);     
      myNewObject.set('orderMobile', order.orderMobile);       
      myNewObject.set('orderAgency', user);
      myNewObject.set('orderInvoice', new Parse.File("factura.pdf", { uri: url[0].toString() }));
      
      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('order created', result);
      } catch (error) {
        console.error('Error while creating order: ', error);
      }
    })();
  }
  updateOrder(order: Order, orderId: string, img: string, hasAlbaran: boolean){
    console.log('asdfsd');
    
    console.log(img);
    
    (async () => {
      const query = new Parse.Query('order');
      try {
        // here you put the objectId that you want to update
        const myNewObject = await query.get(orderId);
        myNewObject.set('orderId', order.orderId);
        myNewObject.set('orderClientName', order.orderClientName);
        myNewObject.set('orderRecieverName', order.orderRecieverName);
        myNewObject.set('orderProvince', order.orderProvince);
        myNewObject.set('orderMunicipio', order.orderMunicipio);
        myNewObject.set('orderAddress', order.orderAddress);
        myNewObject.set('orderReference', order.orderReference);
        myNewObject.set('orderPhone', order.orderPhone);
        myNewObject.set('orderMobile', order.orderMobile);
        myNewObject.set('orderSucursal', order.orderSucursal);
        myNewObject.set('orderNote', order.orderNote);
        myNewObject.set('orderCancelMotive', order.orderCancelMotive);
        if(hasAlbaran && order.state != 'Finalizado'){       
           myNewObject.set('orderAlbaran', new Parse.File("albaranes.jpg", { uri: img })); 
        }
        
        myNewObject.set('state', order.state);
        try {
          const response = await myNewObject.save();
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          // Access the Parse Object attributes using the .GET method
          console.log(response.get('orderProvince'));
          console.log(response.get('orderMunicipio'));
          console.log(response.get('orderAddress'));
          console.log(response.get('orderPhone'));
          console.log(response.get('productArray'));
          console.log(response.get('orderId'));
          console.log(response.get('state'));
          console.log(response.get('orderClientName'));
          console.log(response.get('orderRecieverName'));
          console.log('order updated', response);
        } catch (error) {
          console.error('Error while updating order', error);
          }
        } catch (error) {
          console.error('Error while retrieving object order', error);
        }
    })();
  }

  updateOrderState(orderId: string, state: string){
    (async () => {
      const query = new Parse.Query('order');
      try {
        // here you put the objectId that you want to update
        const myNewObject = await query.get(orderId);
      
        myNewObject.set('state', state);
        try {
          const response = await myNewObject.save();
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          // Access the Parse Object attributes using the .GET method
         
          console.log(response.get('state'));
         
        } catch (error) {
          console.error('Error while updating order', error);
          }
        } catch (error) {
          console.error('Error while retrieving object order', error);
        }
    })();
  }
  deleteOrder(id: string){
    (async () => {
      const query = new Parse.Query('order');
      try {
        // here you put the objectId that you want to delete
        const object = await query.get(id);
        try {
          const response = await object.destroy();
          console.log('Deleted ParseObject', response);
        } catch (error) {
          console.error('Error while deleting ParseObject', error);
        }
      } catch (error) {
        console.error('Error while retrieving ParseObject', error);
      }
    })();
  }

  getOrder(agency: string): Promise <any> {    
    console.log('Agencia');
    console.log(agency);
    
    
    if(agency == 'comercial'){
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      const query2 = new Parse.Query(Orders);   
      query.equalTo('orderAgency', 'patugente');
      query2.equalTo('orderSucursal', 'patugente');     
      const composedQuery = Parse.Query.or(query, query2);    
      query.limit(1000);
      return composedQuery.find() 
    }else if(agency && agency != 'buttymanager' && agency != 'buttycomercial' && agency != 'buttyoperaciones' && agency != 'buttyekonomico'){   
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);    
      query.equalTo('orderAgency', agency);
      query.limit(1000);
      return query.find() 
    }else{
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.notEqualTo('orderAgency', 'patugente');
      query.limit(1000);
      return query.find()
    }   

    
  }
  getOrderSucursal(sucursal: string): Promise <any> {    
    if(sucursal && sucursal != 'buttymanager' && sucursal != 'buttycomercial' && sucursal != 'buttyoperaciones' && sucursal != 'buttyekonomico'){   
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);    
      query.equalTo('orderSucursal', sucursal);
      return query.find() 
    }else{
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      return query.find()
    }   

    
  }
}
