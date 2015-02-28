#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> A simple querybuilder for database, supporting arcgis http rest interface


## Install

```sh
$ npm install --save querying
```


## Usage

```js
var QueryBuilder = require('querying');

var queryBuilder = new QueryBuilder();
queryBuilder.where('USER_ID').is(1234).build(); 
# {where: "USER_ID: '1234'"}
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
