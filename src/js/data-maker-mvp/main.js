import { RenderPosition, render } from './utils/render'
import ContentController from './content/controllers/content'
import LeftContentComponent from './common-component/leftContent'
import MenuListController from './menu/controllers/menu-list'
import { fetchUserMarketFx } from './models/model'

class DataMaker {
  constructor(element, data) {
    this.container = document.querySelector(`${element}`)
    this.marketData = fetchUserMarketFx(data)

    fetchUserMarketFx.done.watch(_ => this.init())
  }

  init() {
    const leftContent = new LeftContentComponent()
    render(this.container, leftContent, RenderPosition.BEFOREEND)

    const rightContent = new ContentController(this.container)
    rightContent.render()

    const menu = new MenuListController(leftContent.getElement())
    menu.render()
  }
}

// export const datat = new DataMaker(
//   `.data-maker`,
//   '[{"userId": "557933","currency": "₽"},[{"id":1,"name":"Футболки","img":"1.png","subCategory":[{"id":2,"name":"Крутые","img":"1.png","productsInCategory":[{"id":3,"name":"Крутая первая","price":"1200","img":"1.png","active":true,"desc":"Состав: чистая крутость<br />Ваще круть","options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":4,"name":"Крутая вторая","price":"1300","img":"2.png"}]},{"id":5,"name":"Не оч крутые","img":"2.png","productsInCategory":[{"id":6,"name":"Ну такая первая","price":"800","img":"1.png","active":true,"desc":"Состав: посредственность<br />Пойдёт","options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"800"}]}}]}]},{"id":7,"name":"Толстковки","img":"1.png","subCategory":[{"id":8,"name":"Крутые2","img":"1.png","subCategory":[{"id":9,"name":"Крутые3","img":"1.png","subCategory":[{"id":10,"name":"Крутая первая толст","price":"1200","img":"1.png","desc":"Состав: чистая крутость<br />Ваще круть","active":true,"options":{"nameOptionList":"Степень крутости","optionList":[{"1":true,"price":"1200"},{"2":true,"price":"300"},{"100500":true,"price":"800"}]}},{"id":11,"name":"Крутая вторая толст","price":"1300","img":"2.png","active":true}]}]},{"id":29,"name":"EEEE!"},{"id":12,"name":"Не оч крутыеТол","img":"2.png","productsInCategory":[{"id":13,"name":"Ну такая первая","price":"800","img":"1.png","desc":"Состав: посредственность<br />Пойдёт","active":true,"options":{"nameOptionList":"Степень обычности","optionList":[{"-1":true,"price":"800"},{"-2":true,"price":"300"},{"-100500":true,"price":"1800"}]}}]}]}]]',
// )
export const datat = new DataMaker(`.data-maker`)
