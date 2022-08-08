export interface ICar {
  name: string;
  color: string;
  id: number;
}
export interface INewCar {
  name: string;
  color: string;
}
export interface IWinner {
  id: number;
  wins: number;
  time: number;
}
export type WinnerUpdate = Pick<IWinner, 'time' | 'wins'>;

export interface ICarsWinners extends ICar, IWinner {

}

export interface IEngine {
  velocity: number;
  distance: number;
}

export interface ICreateElement {
  tagname: string;
  class?: string;
  id?: string;
  parent?: HTMLElement;
  child?: HTMLElement;
  text?: string;
}
export interface ICarInGarage {
  name: string;
  color: string;
  id: number;
  time: number;
  delete(callback: () => void): void;
  update(infoAboutCar: INewCar, callback:() => void): void;
  startStop():void;
}

export type CarsInGarage = {
  cars: Array<ICar>,
  count: number,
};

export type WinnersOnPage = {
  winners: Array<IWinner>,
  count: number,
};
export type WinnersСarsOnPage = {
  carsWinners: Array<ICarsWinners>,
  count:number
};
export type Sort = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export type SortWinners = {
  sort: Sort,
  order: SortOrder
};
