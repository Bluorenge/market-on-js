import { render, RenderPosition } from '../utils/render'
import SearchInputComponent from './component-search-input'
import { debounce } from '../utils/utils'

import { search } from '../products/model-products'
import { createSearchMenu } from '../menu/model-menu'

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

    searchInputComponent.setInputHandler(
      debounce(() => {
        createSearchMenu()
        search({
          searchValue: input.value,
        })
      }, 150)
    )
  }
}
