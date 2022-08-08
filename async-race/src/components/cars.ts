import { ICarInGarage, IEngine, INewCar } from './interfaces';
import {
  deleteCar, deleteWinner, drive, startStop, updateCar,
} from './appLoad';

abstract class Cars implements ICarInGarage {
  id: number;

  name: string;

  color: string;

  animationId:number;

  time: number;

  constructor(id: number, name:string, color:string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.animationId = 0;
    this.time = 0;
  }

  async update(infoAboutCar: INewCar, callback:() => void) {
    await updateCar(this.id, infoAboutCar);
    callback();
  }

  async delete(callback: () => void) {
    await deleteCar(this.id);
    await deleteWinner(this.id);
    callback();
  }

  async startStop() {
    const car = <HTMLElement>document.getElementById(String(this.id));
    const switchInput = <HTMLInputElement>car?.querySelector('.car__switch_input');
    const carFigure = <HTMLElement>car.querySelector('.car__image');
    let engine: IEngine;
    let time;

    if (switchInput.checked) {
      engine = await startStop(this.id, 'started');
      this.animate(carFigure, engine);

      const carBreak = await drive(this.id, 'drive');
      if (carBreak) window.cancelAnimationFrame(this.animationId);
      else time = this.getTime(engine);
    } else {
      engine = await startStop(this.id, 'stopped');
      this.stopAnimate(carFigure);
    }
    return time;
  }

  animate(carFigure:HTMLElement, engine:IEngine) {
    const car = carFigure;

    const { velocity, distance } = engine;

    this.time = Math.round(distance / velocity);
    const carFinish = document.getElementById('raceReset')?.getBoundingClientRect();
    const carStart = document.getElementById('garagePage')?.getBoundingClientRect();
    const endCarPosition = Number(carFinish?.x) - Number(carStart?.x);

    let currentCarPosition = car.offsetLeft;
    const framesCount = (this.time / 1000) * 60;
    const carMoving = (endCarPosition - currentCarPosition) / framesCount;

    const driveCar = () => {
      currentCarPosition += carMoving;
      car.style.transform = `translateX(${currentCarPosition}px)`;
      if (currentCarPosition < endCarPosition) {
        this.animationId = window.requestAnimationFrame(driveCar);
      }
    };
    driveCar();
  }

  stopAnimate(carFigure:HTMLElement) {
    const car = carFigure;
    window.cancelAnimationFrame(this.animationId);
    car.style.transform = 'translateX(0px)';
  }

  getTime(engine:IEngine) {
    const { velocity, distance } = engine;
    const time = Math.round(distance / velocity);
    return time;
  }
}
export default Cars;
