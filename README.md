# Модуль магазина на vanilla js

## История разработки

Сначала модуль был сделан без дробления на компоненты `./src/js/market/` и `./src/js/data-maker/`.  
[магазин](https://bluorenge.github.io/market-on-js/build/market.html)  
[создание структуры магазина](https://bluorenge.github.io/market-on-js/build/data-maker.html)

Потом перепесал его с помощью MVP-паттерна `./src/js/market-mvp/` и `./src/js/data-maker-mvp/`.  
[магазин](https://bluorenge.github.io/market-on-js/build/market-mvp.html)  
[создание структуры магазина](https://bluorenge.github.io/market-on-js/build/data-maker-mvp.html)

## Модуль, отображающий товары

Что реализовано:

- Отображение категорий с бесконечной вложенностью подкатегорий.
- Если лист с товарами выходит за пределы родительского блока, то включается карусель.
- При добавлении карусели, также появляется кастомный скроллбар.
- Также появляется тень справа. При прокрутке до конца списка, она исчезает, чтобы не мешать просмотру.
- Карусель можно двигать с помощью колёсика мыши.
- Поиск по всему магазину. При отсутствии совпадений, показан пустой экран. При удалении, текущее состояние.
- Возможность переходить на разные уровни магазина из меню.
- Если пункты меню выходят за пределы родительского блока, то включается карусель.
- При добавлении карусели на меню, она прокручивается до последнего пункта меню.
- Товары с возможностью выбирать опцию.
- Значок корзины с индикатором количества товара и общей ценой внизу.
- Один товар, но с разными опциями, попадает в корзину как две разные позиции.
- Возможность увеличивать количество товара в корзине, удаление товара.
- Анимация добавления товара, отрисовки списка. Адаптивность.

### Принцип работы магазина

Чтобы магазин заработал, нужно после кода приложения вызвать функцию с двумя аргументами.
Она принимает два параметра в формате json. Первый - глобальные настройки магазина. Второй - структура магазина.
Эту функцию с параметрами нужно предварительно создать в интерфейсе.
Вначале отрисовывается первый уровень массива. Вешается обработчик кликов на получившийся список.
Отрисовка происходит на основе шаблонных строк в блоке `market-content`. Обновление блока происходит динамически.
При клике происходит поиск элемента в массиве по названию карточки товара/категории.
Найденный элемент присваивается переменной, по данным из которой отрисовывается новый список товаров и меню.
При добавлении товара в корзину, создаётся массив с товарами.
При оформлении заказа, в конце блока корзины создаётся textarea с классом `market-cart__textarea`, в который в виде строки попадает этот массив.

## Интерфейс для создания структуры каталога товаров

Что реализовано:

- Возможность задать id-профиля пользователя и название валюты магазина.
- Можно создать бесконечную вложенность подкатегорий.
- При заполнении поля проверяется дублирование названия товара/категории, также сделана валидация.
- В случае существования дубликата, появляется предупреждение. После разрешения конфликта, оно убирается.
- Возможна навигация по tab и tab+shift, чтобы перейти к следующему/предыдущему элементу.
- Возможность добавить/удалить описание и опции товара. Опции можно сделать не/активными.
- При нажатие на кнопку генерации, внизу появляется блок с текстом функции и структурой каталога.
- Реализована возможность копировать получившийся текст по нажатию на кнопку.

### Принцип работы интерфейса

При каждом добавлении блока с полями и ввода значения в поле, создается или модифицируется соответствующий объект в итоговом массиве.
Id-профиля пользователя и название валюты магазина - это объект. Структура магазина - массив.
При генерации списка, этот объект и массив превращаются в строку в формате json и отображаются в блоке, после формы.
Скопированный текст нужно поместить после кода магазина.

## Общая информация

- Проект собирается с помощью сборщика модулей webpack.
- Для стилей используется scss.
- Все внешние зависимости можно увидеть в `package.json`.
- Конфигурация вебпака разделена на три файла: общие настройки, дев и прод.
- Для работы с проектом нужно запустить команду `npm ci`. После установки пакетов запустить проект в дев-режиме `dev` или продакшен `build`.
- Старая версия разбита на 3 модуля: главный модуль, утилиты и шаблоны.
- Новая версия сделана на MVP-паттерне.
- Используется стейт-менеджер [effector](https://github.com/effector/effector).

## Разработка и тестирование

Сейчас магазин автоматически отображает данные.

Дев код находится в папке в `src`. Продакшн код находится в папке `build`.
Чтобы протестировать программу, нужно открыть `market.html` и скопировать в консоль содержимое файла `build/mock/mock.js`.
