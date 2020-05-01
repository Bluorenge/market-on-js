/* 
  Возвращает найденные элементы
  ! функция в функции, потому что привязка к внешней переменной
*/
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
    if (arr !== undefined) {
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

/* Рекурсивный поиск одного элемента по всему массиву
  Функция, принимающая на вход:
    arr - сам массив
    name - имя поиска
*/
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
