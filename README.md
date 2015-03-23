#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> A simple querybuilder for database, supporting arcgis http rest interface


## Install

```sh
$ npm install --save querying
```


## Usage

```js
var QueryBuilder = require('querying');

var queryBuilder = QueryBuilder();
queryBuilder.where('USER_ID').is(1234).build();//where: "USER_ID: '1234'"} 
```



## Methods

### where(key, [value, operator])
Sets an attribute for building query or Sets attribute, value and operator if provided as argument

### is(value)
Sets "=" as operator, and argument as value, takes key from preceding where

### isNot(value)
Sets operator as "<>", argument as value, takes key from preceding where

### grtThan(value)
sets greater than (">") operator for given value and key taken from preceding where

### lessThan(value)
Sets less than ("<") operator for given value and key taken from preceding where

### grtThanAndEqual(value)
Sets less than (">=") operator for given value and key taken from preceding where

### lessThanAndEqual(value)
Sets less than ("<=") operator for given value and key taken from preceding where

### isNull()
Sets "IS NULL" operator for key taken from preceding where

### isNotNull()
Sets "IS NOT NULL" operator for key taken from preceding where

### and(key, [value, operator]) 
Set conjuction 'AND' and Sets next attribute for query 
```js
queryBuilder.where('USER_ID').is(1234).and('ORG_ID').is(25).build();
// where: "USER_ID = '1234' AND ORG_ID = '25' "} 
```

### or(key, [value, operator])
Set conjuction 'OR', and sets next attribute for query

### ASC(key)
Sets ORDER BY clause, argument key as column name for ORDER BY, sorting in ascending order
```js
queryBuilder.where('USER_ID').is(1234).ASC('ORG_ID').build();
//{
// where: 'USER_ID = "1234"',
// orderByFields: 'ORG_ID ASC'
//}
```

### DESC(key)
Sets ORDER BY clause, argument key as column name for ORDER BY, sorting in descending order

### in(values)
Sets IN operator with argument values
```js
queryBuilder.where('USER_ID').in([1234, 233,544]).build();
//{
// where: 'USER_ID IN (1234, 233, 544)'
//}
```

### outfields(columnNames)
Sets select statement with argument columnNames

### returnCountOnly()
Sets returnCountOnly key to true, so that result will be count of record set


### build()
Creates an Object containing all clauses and returns Query object


## Methods for Query

### toString()
returns stringify query object


##Report Issue 
[issue-url]


## License

MIT © [Yashprit](https://yashprit.github.io)

[issue-url]: https://github.com/yashprit/querying/issues
[npm-url]: https://npmjs.org/package/querying
[npm-image]: https://badge.fury.io/js/querying.svg
[travis-url]: https://travis-ci.org/yashprit/querying
[travis-image]: https://travis-ci.org/yashprit/querying.svg?branch=master
[daviddm-url]: https://david-dm.org/yashprit/querying.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/yashprit/querying
