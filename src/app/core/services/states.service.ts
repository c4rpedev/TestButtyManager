import { Injectable } from '@angular/core';
import { GetProvincesService } from './get-provinces.service';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  provincesArray : Array<any> = this.provinces.getOccidente();
  deliveryTime: number;

  constructor(private provinces: GetProvincesService) { }

  getDeliveryTime(province: string){           
    return 8;
  }
}
