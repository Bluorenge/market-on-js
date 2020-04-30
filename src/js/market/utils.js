// Импорт кастомного скроллбара
import PerfectScrollbar from 'perfect-scrollbar'
// Функция карусели
;(function (factory) {
  typeof define === 'function' && define.amd
    ? define(factory)
    : typeof exports === 'object'
    ? (module.exports = factory())
    : factory()
})(function () {
  ;('use strict') // eslint-disable-line no-unused-expressions

  /* globals window:true */
  var _window = typeof window !== 'undefined' ? window : this

  var Glider = (_window.Glider = function (element, settings) {
    var _ = this

    if (element._glider) return element._glider

    _.ele = element
    _.ele.classList.add('glider')

    // expose glider object to its DOM element
    _.ele._glider = _

    // merge user setting with defaults
    _.opt = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesToShow: 1,
        resizeLock: true,
        duration: 0.5,
        // easeInQuad
        easing: function (x, t, b, c, d) {
          return c * (t /= d) * t + b
        },
      },
      settings
    )

    // set defaults
    _.animate_id = _.page = _.slide = 0
    _.arrows = {}

    // preserve original options to
    // extend breakpoint settings
    _._opt = _.opt

    if (_.opt.skipTrack) {
      // first and only child is the track
      _.track = _.ele.children[0]
    } else {
      // create track and wrap slides
      _.track = document.createElement('div')
      _.ele.appendChild(_.track)
      while (_.ele.children.length !== 1) {
        _.track.appendChild(_.ele.children[0])
      }
    }

    _.track.classList.add('glider-track')

    // start glider
    _.init()

    // set events
    _.resize = _.init.bind(_, true)
    _.event(_.ele, 'add', {
      scroll: _.updateControls.bind(_),
    })
    _.event(_window, 'add', {
      resize: _.resize,
    })
  })

  var gliderPrototype = Glider.prototype

  gliderPrototype.init = function (refresh, paging) {
    var _ = this

    var width = 0

    var height = 0

    _.slides = _.track.children
    ;[].forEach.call(_.slides, function (_) {
      _.classList.add('glider-slide')
    })

    _.containerWidth = _.ele.clientWidth

    var breakpointChanged = _.settingsBreakpoint()
    if (!paging) paging = breakpointChanged

    if (_.opt.slidesToShow === 'auto' || _.opt._autoSlide) {
      var slideCount = _.containerWidth / _.opt.itemWidth

      _.opt._autoSlide = _.opt.slidesToShow = _.opt.exactWidth
        ? slideCount
        : Math.floor(slideCount)
    }
    if (_.opt.slidesToScroll === 'auto') {
      _.opt.slidesToScroll = Math.floor(_.opt.slidesToShow)
    }

    _.itemWidth = _.opt.exactWidth
      ? _.opt.itemWidth
      : _.containerWidth / _.opt.slidesToShow

    // set slide dimensions
    ;[].forEach.call(_.slides, function (__) {
      __.style.height = 'auto'
      __.style.width = _.itemWidth + 'px'
      width += _.itemWidth
      height = Math.max(__.offsetHeight, height)
    })

    _.track.style.width = width + 'px'
    _.trackWidth = width

    _.opt.resizeLock && _.scrollTo(_.slide * _.itemWidth, 0)

    if (breakpointChanged || paging) {
      _.bindArrows()
      _.buildDots()
      _.bindDrag()
    }

    _.updateControls()

    _.emit(refresh ? 'refresh' : 'loaded')
  }

  gliderPrototype.bindDrag = function () {
    var _ = this
    _.mouse = _.mouse || _.handleMouse.bind(_)

    var mouseup = function () {
      _.mouseDown = undefined
      _.ele.classList.remove('drag')
    }

    var events = {
      mouseup: mouseup,
      mouseleave: mouseup,
      mousedown: function (e) {
        _.mouseDown = e.clientX
        _.ele.classList.add('drag')
      },
      mousemove: _.mouse,
    }

    _.ele.classList.toggle('draggable', _.opt.draggable === true)
    _.event(_.ele, 'remove', events)
    if (_.opt.draggable) _.event(_.ele, 'add', events)
  }

  gliderPrototype.buildDots = function () {
    var _ = this

    if (!_.opt.dots) {
      if (_.dots) _.dots.innerHTML = ''
      return
    }

    if (typeof _.opt.dots === 'string') {
      _.dots = document.querySelector(_.opt.dots)
    } else _.dots = _.opt.dots
    if (!_.dots) return

    _.dots.innerHTML = ''
    _.dots.classList.add('glider-dots')

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i) {
      var dot = document.createElement('button')
      dot.dataset.index = i
      dot.setAttribute('aria-label', 'Page ' + (i + 1))
      dot.className = 'glider-dot ' + (i ? '' : 'active')
      _.event(dot, 'add', {
        click: _.scrollItem.bind(_, i, true),
      })
      _.dots.appendChild(dot)
    }
  }

  gliderPrototype.bindArrows = function () {
    var _ = this
    if (!_.opt.arrows) {
      Object.keys(_.arrows).forEach(function (direction) {
        var element = _.arrows[direction]
        _.event(element, 'remove', {
          click: element._func,
        })
      })
      return
    }
    ;['prev', 'next'].forEach(function (direction) {
      var arrow = _.opt.arrows[direction]
      if (arrow) {
        if (typeof arrow === 'string') arrow = document.querySelector(arrow)
        arrow._func = arrow._func || _.scrollItem.bind(_, direction)
        _.event(arrow, 'remove', {
          click: arrow._func,
        })
        _.event(arrow, 'add', {
          click: arrow._func,
        })
        _.arrows[direction] = arrow
      }
    })
  }

  gliderPrototype.updateControls = function (event) {
    var _ = this

    if (event && !_.opt.scrollPropagate) {
      event.stopPropagation()
    }

    var disableArrows = _.containerWidth >= _.trackWidth

    if (!_.opt.rewind) {
      if (_.arrows.prev) {
        _.arrows.prev.classList.toggle(
          'disabled',
          _.ele.scrollLeft <= 0 || disableArrows
        )
      }
      if (_.arrows.next) {
        _.arrows.next.classList.toggle(
          'disabled',
          Math.ceil(_.ele.scrollLeft + _.containerWidth) >=
            Math.floor(_.trackWidth) || disableArrows
        )
      }
    }

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth)
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth)

    var middle = _.slide + Math.floor(Math.floor(_.opt.slidesToShow) / 2)

    var extraMiddle = Math.floor(_.opt.slidesToShow) % 2 ? 0 : middle + 1
    if (Math.floor(_.opt.slidesToShow) === 1) {
      extraMiddle = 0
    }

    // the last page may be less than one half of a normal page width so
    // the page is rounded down. when at the end, force the page to turn
    if (_.ele.scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)) {
      _.page = _.dots ? _.dots.children.length - 1 : 0
    }

    ;[].forEach.call(_.slides, function (slide, index) {
      var slideClasses = slide.classList

      var wasVisible = slideClasses.contains('visible')

      var start = _.ele.scrollLeft

      var end = _.ele.scrollLeft + _.containerWidth

      var itemStart = _.itemWidth * index

      var itemEnd = itemStart + _.itemWidth

      ;[].forEach.call(slideClasses, function (className) {
        ;/^left|right/.test(className) && slideClasses.remove(className)
      })
      slideClasses.toggle('active', _.slide === index)
      if (middle === index || (extraMiddle && extraMiddle === index)) {
        slideClasses.add('center')
      } else {
        slideClasses.remove('center')
        slideClasses.add(
          [
            index < middle ? 'left' : 'right',
            Math.abs(index - (index < middle ? middle : extraMiddle || middle)),
          ].join('-')
        )
      }

      var isVisible =
        Math.ceil(itemStart) >= start && Math.floor(itemEnd) <= end
      slideClasses.toggle('visible', isVisible)
      if (isVisible !== wasVisible) {
        _.emit('slide-' + (isVisible ? 'visible' : 'hidden'), {
          slide: index,
        })
      }
    })
    if (_.dots) {
      ;[].forEach.call(_.dots.children, function (dot, index) {
        dot.classList.toggle('active', _.page === index)
      })
    }

    if (event && _.opt.scrollLock) {
      clearTimeout(_.scrollLock)
      _.scrollLock = setTimeout(function () {
        clearTimeout(_.scrollLock)
        // dont attempt to scroll less than a pixel fraction - causes looping
        if (Math.abs(_.ele.scrollLeft / _.itemWidth - _.slide) > 0.02) {
          if (!_.mouseDown) {
            _.scrollItem(_.round(_.ele.scrollLeft / _.itemWidth))
          }
        }
      }, _.opt.scrollLockDelay || 250)
    }
  }

  gliderPrototype.scrollItem = function (slide, dot, e) {
    if (e) e.preventDefault()

    var _ = this

    var originalSlide = slide
    ++_.animate_id

    if (dot === true) {
      slide = slide * _.containerWidth
      slide = Math.round(slide / _.itemWidth) * _.itemWidth
    } else {
      if (typeof slide === 'string') {
        var backwards = slide === 'prev'

        // use precise location if fractional slides are on
        if (_.opt.slidesToScroll % 1 || _.opt.slidesToShow % 1) {
          slide = _.round(_.ele.scrollLeft / _.itemWidth)
        } else {
          slide = _.slide
        }

        if (backwards) slide -= _.opt.slidesToScroll
        else slide += _.opt.slidesToScroll

        if (_.opt.rewind) {
          var scrollLeft = _.ele.scrollLeft
          slide =
            backwards && !scrollLeft
              ? _.slides.length
              : !backwards &&
                scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)
              ? 0
              : slide
        }
      }

      slide = Math.max(Math.min(slide, _.slides.length), 0)

      _.slide = slide
      slide = _.itemWidth * slide
    }

    _.scrollTo(
      slide,
      _.opt.duration * Math.abs(_.ele.scrollLeft - slide),
      function () {
        _.updateControls()
        _.emit('animated', {
          value: originalSlide,
          type:
            typeof originalSlide === 'string' ? 'arrow' : dot ? 'dot' : 'slide',
        })
      }
    )

    return false
  }

  gliderPrototype.settingsBreakpoint = function () {
    var _ = this

    var resp = _._opt.responsive

    if (resp) {
      // Sort the breakpoints in mobile first order
      resp.sort(function (a, b) {
        return b.breakpoint - a.breakpoint
      })

      for (var i = 0; i < resp.length; ++i) {
        var size = resp[i]
        if (_window.innerWidth >= size.breakpoint) {
          if (_.breakpoint !== size.breakpoint) {
            _.opt = Object.assign({}, _._opt, size.settings)
            _.breakpoint = size.breakpoint
            return true
          }
          return false
        }
      }
    }
    // set back to defaults in case they were overriden
    var breakpointChanged = _.breakpoint !== 0
    _.opt = Object.assign({}, _._opt)
    _.breakpoint = 0
    return breakpointChanged
  }

  gliderPrototype.scrollTo = function (scrollTarget, scrollDuration, callback) {
    var _ = this

    var start = new Date().getTime()

    var animateIndex = _.animate_id

    var animate = function () {
      var now = new Date().getTime() - start
      _.ele.scrollLeft =
        _.ele.scrollLeft +
        (scrollTarget - _.ele.scrollLeft) *
          _.opt.easing(0, now, 0, 1, scrollDuration)
      if (now < scrollDuration && animateIndex === _.animate_id) {
        _window.requestAnimationFrame(animate)
      } else {
        _.ele.scrollLeft = scrollTarget
        callback && callback.call(_)
      }
    }

    _window.requestAnimationFrame(animate)
  }

  gliderPrototype.removeItem = function (index) {
    var _ = this

    if (_.slides.length) {
      _.track.removeChild(_.slides[index])
      _.refresh(true)
      _.emit('remove')
    }
  }

  gliderPrototype.addItem = function (ele) {
    var _ = this

    _.track.appendChild(ele)
    _.refresh(true)
    _.emit('add')
  }

  gliderPrototype.handleMouse = function (e) {
    var _ = this
    if (_.mouseDown) {
      _.ele.scrollLeft +=
        (_.mouseDown - e.clientX) * (_.opt.dragVelocity || 3.3)
      _.mouseDown = e.clientX
    }
  }

  // used to round to the nearest 0.XX fraction
  gliderPrototype.round = function (double) {
    var _ = this
    var step = _.opt.slidesToScroll % 1 || 1
    var inv = 1.0 / step
    return Math.round(double * inv) / inv
  }

  gliderPrototype.refresh = function (paging) {
    var _ = this
    _.init(true, paging)
  }

  gliderPrototype.setOption = function (opt, global) {
    var _ = this

    if (_.breakpoint && !global) {
      _._opt.responsive.forEach(function (v) {
        if (v.breakpoint === _.breakpoint) {
          v.settings = Object.assign({}, v.settings, opt)
        }
      })
    } else {
      _._opt = Object.assign({}, _._opt, opt)
    }

    _.breakpoint = 0
    _.settingsBreakpoint()
  }

  gliderPrototype.destroy = function () {
    var _ = this

    var replace = _.ele.cloneNode(true)

    var clear = function (ele) {
      ele.removeAttribute('style')
      ;[].forEach.call(ele.classList, function (className) {
        ;/^glider/.test(className) && ele.classList.remove(className)
      })
    }
    // remove track
    replace.children[0].outerHTML = replace.children[0].innerHTML
    clear(replace)
    ;[].forEach.call(replace.getElementsByTagName('*'), clear)
    _.ele.parentNode.replaceChild(replace, _.ele)
    _.event(_window, 'remove', {
      resize: _.resize,
    })
    _.emit('destroy')
  }

  gliderPrototype.emit = function (name, arg) {
    var _ = this

    var e = new _window.CustomEvent('glider-' + name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg,
    })
    _.ele.dispatchEvent(e)
  }

  gliderPrototype.event = function (ele, type, args) {
    var eventHandler = ele[type + 'EventListener'].bind(ele)
    Object.keys(args).forEach(function (k) {
      eventHandler(k, args[k])
    })
  }

  return Glider
})

/* Рекурсивный поиск одного элемента по всему массиву
  Функция, принимающая на вход:
    arr - сам массив
    name - имя поиска
*/
const findByName = (arr, id, name) =>
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

/* 
  Возвращает найденные элементы
  ! функция в функции, потому что привязка к внешней переменной
*/
const inputFindProduct = (arr, nameFromInput) => {
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

// Путь к элементу (для меню из поиска)
const menuPath = (arr, id, name) => {
  let items = []
  let stopFind = true
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
        // pushData(items, item.id, item.name)
        stopFind = false
      } else if (stopFind) {
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

// Функция задержки выполнения функции
const debounce = (func, wait, immediate) => {
  let timeout

  return function () {
    let context = this,
      args = arguments
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }, wait)

    if (callNow) func.apply(context, args)
  }
}

// Проверка, сенсорное ли устройство
const isTouchDevice = () => {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')

  const mq = function (query) {
    return window.matchMedia(query).matches
  }

  if (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')

  return mq(query)
}

const elementReady = (selector) => {
  return new Promise((resolve) => {
    let el = document.querySelector(selector)
    if (el) {
      resolve(el)
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element)
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect()
      })
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  })
}

const addScrollBar = (element) => {
  // Добавляем скроллбар, если это не тач-устройство
  if (isTouchDevice() === false) {
    new PerfectScrollbar(element)
  }
}

// Создание карусели и скролбара
const carousel = (width, horizontal) => {
  // Обёртка контента страницы
  const marketContentWrap = document.querySelector('.market-content')
  // Размер обёртки карусели
  const carouselWrap = document.querySelector('.market-products__list')

  if (!horizontal) {
    // Добавляем списку вертикальную раскладку
    marketContentWrap
      .querySelector('.market-products__list')
      .classList.add('market-products__list--vertical')
  }

  elementReady('.market-products__list').then((element) => {
    // Проверяем, больше ли длина списка элементов блока, в котором они находятся
    if (element.offsetWidth < width) {
      marketContentWrap.classList.add('market-content--shadow')

      if (horizontal) {
        // Создаём карусель
        new Glider(carouselWrap, {
          slidesToShow: 'auto',
          slidesToScroll: 'auto',
          dots: '.dots',
          dragVelocity: 1,
          responsive: [
            {
              // screens greater than >= 775px
              breakpoint: 775,
              settings: {
                draggable: true,
              },
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3.5,
                slidesToScroll: 1,
                draggable: true,
              },
            },
          ],
        })

        // Проверка, долистан ли скролл до конца блока
        const checkScrollY = (element) => {
          let maxScrollLeft =
            carouselWrap.scrollWidth - carouselWrap.clientWidth

          // Расчёт максимального скролла с запасом
          if (element.scrollLeft >= maxScrollLeft - 15) {
            marketContentWrap.classList.remove('market-content--shadow')
          } else {
            marketContentWrap.classList.add('market-content--shadow')
          }
        }

        // Прокрутка контекта внутри блока
        carouselWrap.addEventListener('wheel', function (e) {
          if (e.deltaY > 0) this.scrollLeft += 50
          else this.scrollLeft -= 50

          checkScrollY(this)
        })

        carouselWrap.addEventListener('scroll', function () {
          checkScrollY(this)
        })
      } else {
        // Проверка, долистан ли скролл до конца блока
        const checkScrollX = (element) => {
          let maxScrollBottom =
            carouselWrap.scrollHeight - carouselWrap.clientHeight

          // Расчёт максимального скролла с запасом
          if (element.scrollTop >= maxScrollBottom - 15) {
            marketContentWrap.classList.remove('market-content--shadow')
          } else {
            marketContentWrap.classList.add('market-content--shadow')
          }
        }

        // * сюда можно сделать какой-нибудь эффект при пролистывания до низа блока
        carouselWrap.addEventListener('scroll', function () {
          // checkScrollX(this)
        })
      }

      addScrollBar(carouselWrap)
    }
  })
}

// Карусель навигации
const carouselNav = (width) => {
  const nav = document.querySelector('.market-header__nav')
  if (nav.offsetWidth < width) {
    new Glider(nav, {
      slidesToShow: 'auto',
      dragVelocity: 1,
      draggable: true,
    }).scrollTo(width)
  }
}

export {
  findByName,
  inputFindProduct,
  menuPath,
  debounce,
  elementReady,
  carousel,
  carouselNav,
  addScrollBar
}
