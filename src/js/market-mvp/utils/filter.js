// Возвращает найденные элементы
export const inputFindProduct = (arr, nameFromInput) => {
  // [] с найденными через input элементами
  let foundItems = []

  /**
   * Рекурсивный поиск всех элементов по всему массиву
   * ! здесь в блоке else привязка к subCategory из массива
   * @param {array} arr - массив, по которому осуществляется поиск
   * @param {string} searchName - имя поиска
   */
  const findProduct = (arr, searchName) => {
    if (arr) {
      // Проходим по каждому элементу массива
      arr.map((item) => {
        if (item.name.toLowerCase().includes(searchName)) {
          foundItems.push(item)
        }
        // Если элемент массива содержит ключ поиска, то..
        else if (item.hasOwnProperty('productsInCategory')) {
          /* Фильтруем переданный массив по имени поиска
              В каждом элементе ищем имя
                приводим его к нижнему регистру
                и проверяем на содержание символов, переданных в атрибуте searchName
          */
          let newItem = item.productsInCategory.filter((item) =>
            item.name.toLowerCase().includes(searchName)
          )

          // Добавляем отфильтрованный массив во внешнюю переменную foundItems
          foundItems = foundItems.concat(newItem)

          return foundItems
        } else {
          // Иначе снова вызываем функцию поиска в подкатегории
          return findProduct(item.subCategory, searchName)
        }
      })
    }
  }

  // ! привязка к исходнуму массиву с данными и названиями категорий
  findProduct(arr, nameFromInput.toLowerCase())

  return foundItems
}

// Рекурсивный поиск одного элемента по всему массиву
export const findByName = (arr, id, name) =>
  arr.reduce((a, item) => {
    // При первой итерации этот if пропускается, потому что передаётся null
    if (a) return a

    // Если текущий элемент массива содержит нужное имя, возращаем его. Если нет, то..
    if (item.id === id && item.name === name) return item

    // ..берём элемент с ключом nestingKey и снова ищём в нём нужное имя, либо..
    if (item.hasOwnProperty('subCategory'))
      return findByName(item.subCategory, id, name)

    // ..если нужно найти элемент в списке товаров в категории
    if (item.hasOwnProperty('productsInCategory'))
      return findByName(item.productsInCategory, id, name)
  }, null)

// Путь к элементу (для меню из поиска)
export const menuPath = (arr, id, name) => {
  let items = []
  let continueFind = true
  const pushData = (arr, id, name) => {
    arr.push({
      id,
      name,
    })
  }

  const find = (arr, findId, findName) => {
    arr.find((item) => {
      if (item.id === findId && item.name === findName) {
        // Добавлять или нет айди и имя найденного элемента
        pushData(items, item.id, item.name)
        continueFind = false
      } else if (continueFind) {
        if (item.hasOwnProperty('subCategory')) {
          // Если в этой ветке содержится нужный элемент
          const there = (newItem) =>
            newItem.some((product) => {
              if (product.id === findId && product.name === findName) {
                pushData(items, item.id, item.name)
              } else if (product.hasOwnProperty('subCategory')) {
                there(product.subCategory)
              } else if (product.hasOwnProperty('productsInCategory')) {
                there(product.productsInCategory)
              }
            })
          there(item.subCategory)
          return find(item.subCategory, findId, findName)
        } else if (item.hasOwnProperty('productsInCategory')) {
          // Если в этой категории содержится нужный элемент
          const there = item.productsInCategory.some(
            (product) => product.id === findId && product.name === findName
          )
          if (there) {
            pushData(items, item.id, item.name)
          }
          return find(item.productsInCategory, findId, findName)
        }
      }
    })
  }
  find(arr, id, name)
  return items
}
