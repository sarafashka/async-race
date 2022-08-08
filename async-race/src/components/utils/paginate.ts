/* eslint no-param-reassign: ["error", { "props": false }] */

function previousPage(page:HTMLElement, callback:() => void) {
  let pageNumber = Number(page.innerHTML);
  if (pageNumber > 1) pageNumber -= 1;
  page.innerHTML = String(pageNumber);
  callback();
}

function nextPage(page:HTMLElement, callback:() => void, onPage:number, amount:number) {
  let pageNumber = Number(page.innerHTML);
  if (amount / onPage > pageNumber) pageNumber += 1;
  page.innerHTML = String(pageNumber);

  callback();
}

export default function paginate(
  direction:string,
  callback: ()=>void,
  page:HTMLElement,
  onPage: number,
  amount:number,
) {
  if (direction === 'prev') previousPage(page, callback);
  if (direction === 'next') nextPage(page, callback, onPage, amount);
}
