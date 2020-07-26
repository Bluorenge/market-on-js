import { entryProductBtn } from './data-maker'

const createFieldsetCategory = (id, typeOfCategory, data) => {
  return `
    <fieldset id="${id}" class="data-maker__fields data-maker__fields--category">
      <div class="data-maker__fields-top">
        <h2 class="data-maker__fields-title">
        ${
          data !== undefined
            ? `${data.name}`
            : `Добавление <span class="data-maker__fields-title-type">${typeOfCategory}</span>`
        }
        </h2>
        <div class="data-maker__hide-btn">Скрыть</div>
        <div class="data-maker__delete-btn data-maker__delete-btn--fields"></div>
      </div>
      <div class="data-maker__fields-content">
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field">Название ${typeOfCategory} *</h3>
          <input class="data-maker__input data-maker__input--name" type="text" name="category-id-${id}" placeholder="Название ${typeOfCategory}" 
          ${data !== undefined ? `value="${data.name}"` : ``} required>
        </label>
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field data-maker__name-field--new-line">
            Картинка ${typeOfCategory} <span>(название картинки из редактора)</span>
          </h3>
          <input class="data-maker__input data-maker__input--img" type="text" name="img-category-id-${id}" placeholder="Название картинки" 
          ${data !== undefined ? `value="${data.img}"` : ``}>
        </label>
      </div>
      <div class="data-maker__add data-maker__add--product" tabindex="0">
        + Добавить товар
      </div>
      <div class="data-maker__add data-maker__add--subcategory" tabindex="0">
        + Добавить подкатегорию
      </div>
    </fieldset>
  `
}

const createFieldsetProduct = (id, data) => {
  return `
    <fieldset id="${id}" class="data-maker__fields data-maker__fields--product">
      <div class="data-maker__fields-top">
        <h2 class="data-maker__fields-title">
          ${data !== undefined ? `${data.name}` : `Добавление товара`}
        </h2>
        <div class="data-maker__hide-btn">Скрыть</div>
        <div class="data-maker__delete-btn data-maker__delete-btn--fields"></div>   
      </div>
      <div class="data-maker__fields-content">
        <div class="data-maker__field-wrap">
          <h3 class="data-maker__name-field">Название товара *</h3>
          <input class="data-maker__input data-maker__input--name" type="text" name="name-product-id-${id}" placeholder="Название товара" 
          ${data !== undefined ? `value="${data.name}"` : ``} required>
          <span>В наличии:</span>
          <input class="data-maker__input data-maker__input--product-active" type="checkbox"
          ${data !== undefined ? (data.active ? `checked` : ``) : `checked`}>
        </div>
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field data-maker__name-field--new-line">Название картинки <span>(название файла из редактора)</span></h3>
          <input class="data-maker__input data-maker__input--img" type="text" name="img-product-id-${id}" placeholder="Название картинки" 
          ${data !== undefined ? `value="${data.img}"` : ``}>
        </label>
        <label class="data-maker__field-wrap">
          <h3 class="data-maker__name-field">Цена товара *</h3>
          <input class="data-maker__input data-maker__input--price-product" type="number" name="price-product-id-${id}" placeholder="Цена товара" 
          ${data !== undefined ? `value="${data.price}"` : ``} required>
        </label>
      </div>
      <div class="data-maker__add data-maker__add--desc" tabindex="0">
        + Добавить описание
      </div>
      <div class="data-maker__add data-maker__add--option-wrap" tabindex="0">
        + Добавить товару опцию
      </div>
    </fieldset>
  `
}

const createProductDesc = (id, text) => {
  return `
    <label class="data-maker__field-wrap data-maker__field-wrap--desc">
      <div class="data-maker__fields-top">
        <h3 class="data-maker__name-field">Описание товара:</h3>
        <div class="data-maker__delete-btn data-maker__delete-btn--desc"></div>
      </div>  
      <textarea class="data-maker__input data-maker__input--desc-product" name="desc-product-id-${id}" placeholder="Поддерживает перенос строк">${
    text !== undefined ? text : ``
  }</textarea>
    </label>
  `
}

const createOption = (id, numberOption, state) => {
  return `
    <div class="data-maker__option-item">
      <label class="data-maker__option-field-wrap">
        <h4 class="data-maker__name-field">Опция <span class="data-maker__option-num">${numberOption}</span></h4>
        <input class="data-maker__input data-maker__input--option-name data-maker__input--option-${
          state !== undefined ? state : numberOption
        }-product" type="text" name="option-${numberOption}-product-id-${id}" placeholder="Например: M"
        ${state !== undefined ? `value="${state.map(([key]) => key)[0]}"` : ``} required>
      </label>
      <label class="data-maker__option-field-wrap">
        <span class="data-maker__name-field">Цена</span>
        <input class="data-maker__input data-maker__input--option-price" type="number" placeholder="Введите цену товара"
        ${state !== undefined ? `value="${state.map(([, value]) => value)[1]}"` : ``} required>
      </label>
      <label class="data-maker__option-field-wrap">
        <input class="data-maker__input data-maker__input--option-active" type="checkbox"
        ${
          state !== undefined
            ? state.map(([, value]) => value)[0] === true
              ? `checked`
              : ``
            : `checked`
        }>
        <span>Сделать активной</span>
      </label>
    </div>
  `
}

const createOptionWrap = (id, state) => {
  return `
    <div class="data-maker__option-wrap">
      <label class="data-maker__field-wrap">
        <div class="data-maker__fields-top">
          <h3 class="data-maker__name-field">Название группы опций</h3>
          <div class="data-maker__delete-btn data-maker__delete-btn--option"></div>
        </div>
        <input class="data-maker__input data-maker__input--option-list-name" type="text" name="option-title-product-id-${id}" placeholder="Название опции" required
        ${state !== undefined ? `value="${state.nameOptionList}"` : ``}>
      </label>
      <div class="data-maker__option">
      ${
        state !== undefined
          ? state.optionList
              .map((item, index) => createOption(id, index + 1, Object.entries(item)))
              .join(``)
          : createOption(id, 1)
      }
      </div>
      <div class="data-maker__add data-maker__add--option-item" tabindex="0">+ Добавить опцию</div>
    </div>
  `
}

// `subCategory`, `productsInCategory`
const createTree = (arr, firstLevel, secondLevel) => {
  const rootNode = document.querySelector(`.data-maker`)

  const newTree = (arr, firstLevel, secondLevel, indexItem) => {
    arr.map(item => {
      // Если у элемента нет подкатегорий и товаров внутри
      if (firstLevel in item === false && secondLevel in item === false) {
        // Значит это товар
        const newProduct = createFieldsetProduct(item.id, item)
        const desc =
            item.desc !== undefined
              ? createProductDesc(item.id, item.desc.replace(/<br\s*[/]?>/gi, `\n`))
              : ``,
          option = item.options !== undefined ? createOptionWrap(item.id, item.options) : ``

        // Ищем родительскую категорию
        const parentCategory = rootNode.querySelector(`#${CSS.escape(indexItem)}`)

        if (parentCategory !== null) {
          const btnAddProduct = parentCategory.querySelector(`.data-maker__add--product`)
          btnAddProduct.insertAdjacentHTML(`beforebegin`, newProduct)
        } else {
          // То отрисовываем товар на первом уровне
          entryProductBtn.insertAdjacentHTML(`beforebegin`, newProduct)
        }

        const productNode = document.getElementById(item.id)

        const productDescBtn = productNode.querySelector(`.data-maker__add--desc`)
        if (productDescBtn !== null) {
          productDescBtn.insertAdjacentHTML(`beforebegin`, desc)
          productDescBtn.remove()
        }

        const productOptionsBtn = productNode.querySelector(`.data-maker__add--option-wrap`)
        if (productOptionsBtn !== null) {
          productOptionsBtn.insertAdjacentHTML(`beforebegin`, option)
          productOptionsBtn.remove()
        }
      }
      // Иначе если есть продукты в категории
      else if (secondLevel in item) {
        const newCategory = createFieldsetCategory(item.id, `подкатегории`, item)

        const parentCategory = rootNode.querySelector(`#${CSS.escape(indexItem)}`)

        const btnAddProduct = parentCategory.querySelectorAll(`.data-maker__add--product`)
        btnAddProduct[btnAddProduct.length - 1].insertAdjacentHTML(`beforebegin`, newCategory)

        return newTree(item[secondLevel], firstLevel, secondLevel, item.id)
      }
      // Иначе если есть категории
      else {
        // Создаём категорию
        let newCategory

        const parentCategory = rootNode.querySelector(`#${CSS.escape(indexItem)}`)

        if (parentCategory !== null) {
          const btnAddProduct = parentCategory.querySelector(`.data-maker__add--product`)
          newCategory = createFieldsetCategory(item.id, `подкатегории`, item)
          btnAddProduct.insertAdjacentHTML(`beforebegin`, newCategory)
        } else {
          newCategory = createFieldsetCategory(item.id, `категории`, item)
          // Отрисовываем категорию на первом уровне
          entryProductBtn.insertAdjacentHTML(`beforebegin`, newCategory)
        }

        return newTree(item[firstLevel], firstLevel, secondLevel, item.id)
      }
    })
  }
  newTree(arr, firstLevel, secondLevel)
}

export {
  createFieldsetCategory,
  createFieldsetProduct,
  createProductDesc,
  createOptionWrap,
  createOption,
  createTree,
}
