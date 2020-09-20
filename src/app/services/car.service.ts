import { Injectable } from '@angular/core';
import carsList from 'assets/carslist.json';
import { filter } from 'minimatch';


@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor() { }

  getCurrentCar() {
    let car:any = sessionStorage.getItem('currentCar');

    if (car && car != "null") {
      car =  JSON.parse(car);

      let makerStr = car.maker.split(' ')[0].toLowerCase();
      let modelStr = car.model.toLowerCase().replace(makerStr,"").trim();

      let filtered = carsList.filter( (maker) =>  maker.maker.toLowerCase().includes(makerStr));

      if (filtered && filtered.length) {
        let cars = filtered[0].cars.filter( (_car) => _car.model.toLowerCase().includes(modelStr));

        if (cars && cars.length) {
          return {
            ...cars[0],
            ...car,
            maker: car.maker
          }
        }
      }

    } else {
      return null;
    }
  }
}
