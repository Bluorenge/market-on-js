import AbstractComponent from '../../utils/abstarct-component'
import elementReady from 'element-ready'

const addDescBtn = `<div class="data-maker__add data-maker__add--desc" tabindex="0">
  <span>+ Добавить описание</span>
</div>`

export default class AddDescBtnComponent extends AbstractComponent {
  getTemplate() {
    return addDescBtn
  }

  setAddDescHandler(handler) {
    ;(async () => {
      const el = await elementReady('.' + this.getElement().classList[1])

      el.addEventListener(`click`, handler)
    })()
  }
}
