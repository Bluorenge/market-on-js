import { render, remove, RenderPosition } from '../utils/render'
import SearchInputComponent from '../components/search-input'
import { debounce } from '../utils/utils'

import { changeProductListStateFromInput,search } from '../models/products'

export default class SearchInputController {
  constructor(container) {
    this._container = container
  }

  render() {
    const header = this._container.getElement()
    const searchInputComponent = new SearchInputComponent()
    render(header, searchInputComponent, RenderPosition.BEFOREEND)
    const input = searchInputComponent.getInput()

    searchInputComponent.setInputHandler(
      debounce(() => {
        // search({
        //   searchValue: input.value,
        // })
        changeProductListStateFromInput({
          searchValue: input.value,
        })
      }, 150)
    )
  }
}
