import { RenderPosition, render, remove } from '../../utils/render'

import OptionListComponent from '../components/optionList'
import { $isFormValidate, findItem } from '../../models/model'
import OptionComponent from '../components/option'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'

const createArrayOfOptions = (container, arr) =>
  arr.map((item, index) => {
    const optionComponent = new OptionComponent(++index, item)
    render(container, optionComponent, RenderPosition.BEFOREEND)
    return optionComponent
  })

export default class OptionListController {
  constructor(container, productId) {
    // Обёртка опций
    this.container = container
    this.productId = productId

    this._data = null
    // Компонент списка опций
    this._optionListComponent = null
    // Массив в компонентами опций
    this._optionItems = []
  }

  render() {
    // Ищем элемент в данных магазина
    eventsForDataMaker.searchItem({ id: this.productId })
    this._data = findItem
    this._optionListComponent = new OptionListComponent(this._data)
    // Отрисовываем лист с опциями
    render(this.container.getElement(), this._optionListComponent, RenderPosition.BEFOREEND)
    // Отрисовываем опции
    this._renderOptions()
    // Вешаем слушатель на кнопку удаления всех опций
    this._optionListComponent.setRemoveOptionsHandler(() =>
      // Удаляем опцию из данных магазина
      eventsForDataMaker.deleteOptions({ id: this.productId }),
    )
    // Вешаем слушатель на инпут с названием опций
    this._optionListComponent.setInputHandler(() => this.getData())
    // Слушатель на кнопку добавления опции
    this._optionListComponent.setAddOptionBtnHandler(() => {
      // Проверяем валидность формы, чтобы показать ошибку дублирования имени опции
      eventsForDataMaker.validateFrom()

      // Если поле валидно и нет дупликатов имени опции
      if ($isFormValidate.getState() && !this._isDuplicateNameOfOptionExist()) {
        this._removeOptions()
        this._renderOptions(true)
        this.getData()
      }
    })
  }

  getData() {
    // Получаем имя списка опции
    const optionListName = this._optionListComponent.getOptionListName()
    // Список опций
    const optionList = arr => {
      let data = []
      arr.forEach(item => {
        data.push(item.getOptionData())
      })
      return { optionList: data }
    }
    const options = Object.assign(optionListName, optionList(this._optionItems))
    eventsForDataMaker.makeOptions({
      id: this.productId,
      options,
    })
    return options
  }

  destroy() {
    this._removeOptions()
    remove(this._optionListComponent)
  }

  _isDuplicateNameOfOptionExist() {
    const optionList = this._data.options.optionList

    if (optionList) {
      let duplicateExist = false

      this._optionItems.forEach(item => {
        const getQuanty = arr =>
          arr.reduce((acc, arrItem) => {
            if (arrItem.name === item.getOptionData().name) {
              acc++
            }
            return acc
          }, 0)

        if (getQuanty(optionList) < 2) {
          item.getNameInput().setCustomValidity('')
          item.removeErrorClass()
        } else {
          item.getNameInput().setCustomValidity('Такое имя опции уже существует')
          item.addErrorClass()
          duplicateExist = true
        }
      })
      return duplicateExist
    }
  }

  _renderOptions(addNewOption = false) {
    eventsForDataMaker.searchItem({ id: this.productId })
    // Если в листе уже есть опции
    if (this._data?.options?.optionList) {
      const optionList = this._data.getState().options.optionList
      // Отрисовываем его
      this._optionItems = createArrayOfOptions(
        this._optionListComponent.getOptionList(),
        optionList,
      )

      // Если нужна новая опция
      if (addNewOption) {
        this._renderNewOption(++optionList.length)
      }
    } else {
      this._renderNewOption()
    }
    // Вешаем обработчик на название, цену и статус опции
    this._optionItems.forEach(item => {
      item.setInputHandler(() => {
        this.getData()
        this._isDuplicateNameOfOptionExist()
      })
      // Если опций больше чем одна, то вешаем слушатель
      if (this._optionItems.length > 1) {
        item.setRemoveOptionBtnHandler(() => {
          this._removeOptions(item.getIndex())
          this._renderOptions()
        })
      } else {
        // Иначе скрываем кнопку удаления
        item.setRemoveOptionBtn()
      }
    })
  }

  _renderNewOption(index = 1) {
    const newOptionComponent = new OptionComponent(index)
    this._optionItems = this._optionItems.concat(newOptionComponent)
    render(this._optionListComponent.getOptionList(), newOptionComponent, RenderPosition.BEFOREEND)
  }

  _removeOptions(index) {
    this._optionItems.forEach(item => {
      if (index && item.getIndex() === index) {
        // Удаляем опцию из массива, соотвествующую переданному индексу
        eventsForDataMaker.deleteOption({
          id: this.productId,
          index: item.getIndex() - 1,
        })
      }
      remove(item)
    })
    this._optionItems = []
  }
}
