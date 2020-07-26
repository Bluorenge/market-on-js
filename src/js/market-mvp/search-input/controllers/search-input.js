import { render, RenderPosition } from '../../utils/render'
import SearchInputComponent from '../components/search-input'
import { debounce } from '../../utils/utils'

import { eventsForStore } from '../../models/eventsForStore'

export default class SearchInputController {
  constructor(container) {
    this._container = container
  }

  render() {
    const searchInputComponent = new SearchInputComponent()
    render(this._container.getElement(), searchInputComponent, RenderPosition.BEFOREEND)
    const input = searchInputComponent.getInput()
    // Следим за вызовом события очищения поля поиска
    eventsForStore.clearSearchInput.watch(() => (input.value = ``))
    eventsForStore.disabledSearch.watch(() => (input.disabled = true))
    eventsForStore.enabledSearch.watch(() => (input.disabled = false))

    searchInputComponent.setInputHandler(
      debounce(() => {
        eventsForStore.createSearchMenu()
        eventsForStore.search({
          searchValue: input.value,
        })
      }, 150),
    )
  }
}
