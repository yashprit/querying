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
sets less than ("<") operator for given value and key taken from preceding where

### isNull()
sets "IS NULL" operator for key taken from preceding where

### isNotNull()
sets "IS NOT NULL" operator for key taken from preceding where

### and() 
set conjuction 'AND' 
```js
queryBuilder.where('USER_ID').is(1234).and('ORG_ID').is(25).build();//where: "USER_ID = '1234' AND ORG_ID = '25' "} 
```
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
