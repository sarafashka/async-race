import {
  ICar, IEngine, INewCar, IWinner, SortOrder, Sort, WinnerUpdate,
} from './interfaces';

const url = 'http://127.0.0.1:3000/';

export async function getCars(page?:number, limit?:number) {
  let cars: Array<ICar>;
  let count: number;

  const link = page && limit ? `?_page=${page}&_limit=${limit}` : '';
  try {
    const response = await fetch(`${url}garage${link}`);
    cars = await response.json();
    count = Number(response.headers.get('X-Total-Count'));
  } catch (error) {
    throw new Error('Error get cars');
  }
  const carsInGarage = { cars, count };
  return carsInGarage;
}

export async function getCar(id:number) {
  let car: ICar;
  try {
    const response = await fetch(`${url}garage/${id}`);
    car = await response.json();
  } catch (error) {
    throw new Error('Error get car');
  }
  return car;
}

export async function createCar(carInfo: INewCar) {
  try {
    await fetch(`${url}garage`, {
      method: 'POST',
      body: JSON.stringify(carInfo),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error('Error create car');
  }
}

export async function updateCar(id:number, carInfo: INewCar) {
  try {
    await fetch(`${url}garage/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carInfo),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error('Error update car');
  }
}

export async function deleteCar(carID:number) {
  try {
    const response = await fetch(`${url}garage/${carID}`, {
      method: 'DELETE',
    });
    await response.json();
  } catch (error) {
    throw new Error('Error delete car');
  }
}

export async function startStop(id:number, status: string) {
  let engine: IEngine;
  try {
    const responce = await fetch(`${url}engine/?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    engine = await responce.json();
  } catch (error) {
    throw new Error('Error start or stop car');
  }
  return engine;
}

export async function drive(id:number, status: string) {
  let carBreak:boolean;
  try {
    const responce = await fetch(`${url}engine/?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    carBreak = responce.status === 500;
  } catch (error) {
    throw new Error('Error drive car');
  }
  return carBreak;
}
export async function getWinners(page:number, sort:Sort, order:SortOrder, limit:number) {
  let winners:Array<IWinner>;
  let count:number;
  try {
    const response = await fetch(`${url}winners/?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    winners = await response.json();
    count = Number(response.headers.get('X-Total-Count'));
  } catch (error) {
    throw new Error('Error get winners');
  }
  const WinnersOnPage = { winners, count };
  return WinnersOnPage;
}

export async function getWinner(id:number) {
  let winner: IWinner | false;
  try {
    const response = await fetch(`${url}winners/${id}`);
    winner = response.status === 200 ? await response.json() : false;
  } catch (error) {
    throw new Error('Error get the winner');
  }
  return winner;
}

export async function createWinner(winnerInfo:IWinner) {
  try {
    await fetch(`${url}winners`, {
      method: 'POST',
      body: JSON.stringify(winnerInfo),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error('Error create the car');
  }
}
export async function deleteWinner(carID:number) {
  try {
    const response = await fetch(`${url}winners/${carID}`, {
      method: 'DELETE',
    });
    await response.json();
    if (response.status === 404) {
      throw new Error('404');
    }
  } catch (error) {
    console.log('Error delete the winner');
  }
}

export async function updateWinner(id:number, winnerUpdate: WinnerUpdate) {
  try {
    await fetch(`${url}winners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(winnerUpdate),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error('Error update the winner');
  }
}
