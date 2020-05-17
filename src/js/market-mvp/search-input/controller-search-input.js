import { render, RenderPosition } from '../utils/render'
import SearchInputComponent from './component-search-input'
import { debounce } from '../utils/utils'
import { eventsForStore } from '../main/eventsForStore'
import { $productList } from '../products/model-products'

export default class SearchInputController {
  constructor(container) {
    this._container = container
  }

  render() {
    const searchInputComponent = new SearchInputComponent()
    render(
      this._container.getElement(),
      searchInputComponent,
      RenderPosition.BEFOREEND
    )
    const input = searchInputComponent.getInput()
    // При изменении состояния списка продуктов, очищаем поле
    $productList.watch(
      eventsForStore.changeProductListState,
      () => (input.value = '')
    )

    searchInputComponent.setInputHandler(
      debounce(() => {
        eventsForStore.createSearchMenu()
        eventsForStore.search({
          searchValue: input.value,
        })
      }, 150)
    )
  }
}
