# Фильтрация и парсилка для сообщений с канала "Кроссовки на скидках"

## Получение постов

`/api/user/`

`name` - имя товара или часть имени товара

`brand` - название брэнда

`shoeType` - тип обуви

`discountFrom` - скидка в процентах от
`discountTo` - до

`priceFrom` - цена от
`priceTo` - цена после

`sizes` - размеры через запятую, если нужно указать тип размера - это делается так: `EU:30`, если типа нет - просто пишем размер `XXL`, `S`, для безразмерных вещей пишем `onesize`

## Загрузка постов

`POST /parse`

Ожидает `json` подобного вида:

```json
[{"id":1, "date":1541706617, "message":"Maison Margiela 22 Replica Low Reflective\n\nстарая цена: 29500 yoox.com\nновая цена: 11700 (FSMCYOOX; -25% автоматически в корзине) http://fas.st/m60Ndf\n\nразмеры: EU 39, 40, 41, 42, 43"},
 {"id":2, "date":1541706617, "message":"Худи на молнии Superdry\n\nстарая цена: 7390 asos.com\nновая цена: 1953 (промо: HURRY30) http://fas.st/PNsXx\n\nразмеры: #S #L #XL #XXL"},
{"id":3, "date":1541706617, "message":"Наручные часы Casio\n\nстарая цена: 1290 asos.com\nновая цена: 903 (HURRY30) http://fas.st/fFxWX\n\nразмеры: #One size"},
{"id":4, "date":1541706617, "message":"Nike Air Force 1 LV8 Utility\n\nстарая цена: 8290 asos.com\nновая цена: 5803 (промо: HURRY30) http://fas.st/sB8LO\n\nразмеры: EU 42,5-43, 44-46, 47,5-48"}]
```