/*
 *                       _           
  __ _ _  _ ___ _ _ _  _(_)_ _  __ _ 
 / _` | || / -_) '_| || | | ' \/ _` |
 \__, |\_,_\___|_|  \_, |_|_||_\__, |
    |_|             |__/       |___/ Yet Another Query Builder
 
 * https://github.com/yashprit/querying
 */

var _ = require("underscore");

/**
 * @constructor
 * 
 * A constructor for query object
 * it holds claues for query
 */
function Query() {
  this.where;
  this.outFields;
  this.orderByFields;
  this.returnCountOnly;
}
/**
 * toString returns query string
 * 
 * .toString()
 *  
 * @return {String} returns query string
 */
Query.prototype.toString = function toString() {
  return JSON.stringify(this);
}
/**
 * toJSON returns query object 
 * 
 * .toJSON()
 * 
 * @return {Object} 
 */
Query.prototype.toJSON = function toString() {
  var temp = {};
  if (this.where) temp.where = this.where;
  if (this.outFields) temp.outFields = this.outFields;
  if (this.orderByFields) temp.orderByFields = this.orderByFields;
  if (this.returnCountOnly) temp.returnCountOnly = this.returnCountOnly;
  temp.f = 'json';
  return temp;
}
/**
 * QueryBuilder
 * 
 * @constructor
 * 
 * A constructor for a query builder object.
 * contains various temporary attribute for budilding query
 */
function QueryBuilder() {
  if (!(this instanceof QueryBuilder))
    return new QueryBuilder();

  this._cols = [];
  this._value = [];
  this._operator = [];
  this._conjunction = [];
  this._whereClause;
  this._outFields = [];
  this._orderByFields = "";
  this._returnCountOnly = false;
  this._query = new Query();
}

/**
 * operators 
 * @type {Object}
 */
QueryBuilder.Operators = {
  EQUAL: "=",
  NOT_EQUAL: "<>",
  ASC: "ASC",
  DESC: "DESC",
  AND: "AND",
  OR: "OR",
  GREATER: '>',
  LESS: '<',
  GREATER_EQUAL: '>=',
  LESS_EQUAL: '<=',
  IS_NULL: 'IS NULL',
  IS_NO_NULL: 'IS NOT NULL',
  IN: 'IN'

};


/**
 * This is internal method, used by various method to set operator
 *
 * @private
 *
 * ._setOperator(value, operator)
 *
 * @param {(String|Number)} value
 * @param {String} operator
 */
QueryBuilder.prototype._setOperator = function _setOperator(value, operator) {
  if (_.isUndefined(value) || _.isNull(value)) {
    throw new TypeError("Missing argument");
  }

  if (_.isEmpty(this._cols)) {
    throw new TypeError("No key found for value " + value);
  }

  this._value.push(value);
  this._operator.push(operator);
};

/**
 * Concatenate space to input String
 *
 * @private
 *
 * @param {String} value
 * @return {String} value
 */
QueryBuilder.prototype._wrapSpace = function _wrapSpace(value) {
  return [" ", value, " "].join("");
};

/**
 * Concatenate quotes to input String
 *
 * @private
 *
 * @param {String} value
 * @return {String} value
 */
QueryBuilder.prototype._wrapQuotes = function _wrapQuotes(value) {
  return ["'", value, "'"].join("");
};

/**
 * overloaded where method
 *
 * .where(key)
 * .where(key, value, operator)
 *
 * Set an attribute, for building query
 * Set an attribute, value and operator for building query
 *
 * @param {String} key
 * @param {String} value
 * @param {String} operator
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.where = function where(key, value, operator) {
  if (value && !operator) {
    throw new TypeError("Missing no of arguments");
  }

  if (this._cols.length && this._cols.length !== this._conjunction.length) {
    throw new TypeError("Invalid query");
  }

  if (key && value && operator) {
    value = "'" + value + "'";
    this._cols.push(key);
    this._value.push(value);
    this._operator.push(operator);
    return this;
  }

  this._cols.push(key);
  return this;
};

/**
 * Set operator as '=' and
 * takes value of previously set col by where
 *
 * .is(value)
 *
 * @param {String} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.is = function is(value) {
  if (_.isEmpty(this._cols)) {
    throw new TypeError("No key found for value " + value);
  }


  this._value.push("'" + value + "'");
  this._operator.push(QueryBuilder.Operators.EQUAL);
  return this;
};


/**
 * Set operator as '<>' and
 * takes value of previously set col by where
 *
 * .isNot(value)
 *
 * operator is _operator.NOT_EQUAL
 *
 * @param {String} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.isNot = function isNot(value) {
  if (_.isEmpty(this._cols)) {
    throw new TypeError("No key found for value " + value);
  }

  this._value.push("'" + value + "'");
  this._operator.push(QueryBuilder.Operators.NOT_EQUAL);
  return this;
};

/**
 * Sets operator as '>' and
 * takes value of previously set col by where
 *
 *.grtThan(value)
 *
 * operator is _operator.GREATER
 *
 * @param {(String|Number)} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.grtThan = function grtThan(value) {
  this._setOperator(value, QueryBuilder.Operators.GREATER);
  return this;
};

/**
 * Sets operator and
 * takes value of previously sel column by where
 *
 * .lessThan(value)
 *
 * operator is _operator.LESS
 *
 * @param {(String|Number)} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.lessThan = function lessThan(value) {
  this._setOperator(value, QueryBuilder.Operators.LESS);
  return this;
};

/**
 * Sets operator and
 * takes value of previously sel column by where
 *
 * .grtThanAndEqual(value)
 *
 * operator is _operator.GREATER_EQUAL
 *
 * @param {(String|Number)} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.grtThanAndEqual = function grtThanAndEqual(value) {
  this._setOperator(value, QueryBuilder.Operators.GREATER_EQUAL);
  return this;
};

/**
 * Sets operator and
 * takes value of previously sel column by where
 *
 * .lessThanAndEqual(value)
 *
 * operator is _operator.LESS_EQUAL
 *
 * @param {(String|Number)} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.lessThanAndEqual = function lessThanAndEqual(value) {
  this._setOperator(value, QueryBuilder.Operators.LESS_EQUAL);
  return this;
};

/**
 * Set operator as 'IS NOT NULL' and
 * takes value of previously set col by where
 *
 * .isNull()
 *
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.isNotNull = function isNotNull(value) {
  if (value) {
    throw new TypeError("Invalid value " + value);
  }
  this._setOperator('', QueryBuilder.Operators.IS_NO_NULL);
  return this;
};

/**
 * Set operator as 'IS NULL' and
 * takes value of previously set col by where
 *
 * .isNull()
 *
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.isNull = function isNull(value) {
  if (value) {
    throw new TypeError("Invalid value " + value);
  }
  this._setOperator('', QueryBuilder.Operators.IS_NULL);
  return this;
};

/**
 * overloaded and method
 *
 * .and(key)
 * .and(key, value, operator)
 *
 * Set conjunction and
 * takes value of previously set col by where
 *
 * conjunction is QueryBuilder.Operators.AND
 *
 * @param {String} key
 * @param {String} value
 * @param {String} operator
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.and = function and(key, value, operator) {
  if (!(this._cols.length && this._value.length && this._cols.length === this._value.length)) {
    throw new TypeError("Invalid query")
  }
  this._conjunction.push(QueryBuilder.Operators.AND);
  this.where(key, value, operator);
  return this;
};

/**
 * overloaded or method
 *
 * .or(key)
 * .or(key, value, operator)
 *
 * Set conjunction and
 * takes value of previously set col by where
 *

 * @param {String} key
 * @param {String} value
 * @param {String} operator
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.or = function or(key, value, operator) {
  if (!(this._cols.length && this._value.length && this._cols.length === this._value.length)) {
    throw new TypeError("Invalid query")
  }
  this._conjunction.push(QueryBuilder.Operators.OR);
  this.where(key, value, operator);
  return this;
};

/**
 * Set operator as 'ASC' and
 * takes value of column to be ordered
 *
 * .ASC(value)
 *
 * @param {String} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.ASC = function ASC(value) {
  if (_.isEmpty(value)) {
    throw new TypeError("No column found for ASC ");
  }

  this._orderByFields = value.concat(" ").concat(QueryBuilder.Operators.ASC);
  return this;
};

/**
 * is method
 * @param {String} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.DESC = function DES(value) {
  if (_.isEmpty(value)) {
    throw new TypeError("No column found for DESC ");
  }

  this._orderByFields = value.concat(" ").concat(QueryBuilder.Operators.DESC);
  return this;
};

/**
 * overloaded in method
 *
 * .in(Array)
 * .in(String)
 *
 * Sets operator and
 * takes value of previously sel column by where
 *
 * .in(value)
 *
 * operator is _operator.IN
 *
 * @param {(String|Array)} value
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.in = function valueIn(value) {
  if (!value) {
    throw new TypeError("Missing arguments");
  }
  if (_.isObject(value) && !_.isArray(value)) {
    throw new TypeError("Invalid input");
  }
  if(_.isArray(value)) {
    value = _.map(value, function(val) {
      return this._wrapQuotes(val);
    }.bind(this));
    value = value.join(",");
  } else {
    value = this._wrapQuotes(value);
  }
  this._setOperator('(' + value + ')', QueryBuilder.Operators.IN);

  return this;
};

/**
 * overloaded version of outFields
 *
 * .outFields(Array)
 * .outFields(CommaSepratedString)
 * .outFields(String)
 *
 * Set cols required for this query
 *
 * @param {Array} outFields
 * @param {String} outFields
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.outFields = function outFields(outFields) {

  if (_.isNumber(outFields)) {
    throw new TypeError("Only String allowed");
  }

  if (_.isString(outFields) && outFields.match(/(,)/)) {
    outFields = outFields.split(",");
  }

  outFields = _.isArray(outFields) ? outFields : [outFields];

  this._outFields = this._outFields.concat(outFields);
  return this;
};
/**
 * returnCountOnly will make querybuilder to set returnCountOnly to true,
 * this will make query return only count of result set ans not whole result set
 *
 * .returnCountOnly()
 * 
 * @return {QueryBuilder} queryBuilder
 */
QueryBuilder.prototype.returnCountOnly = function returnCountOnly(){
  this._returnCountOnly = true;
  return this;
}

/**
 * build method
 * @return {Object|Query} query
 */
QueryBuilder.prototype.build = function build() {

  var zipArray = _.zip(this._cols, this._operator, this._value);

  var joinedArray = _(zipArray).reduce(function(acc, value) {
    return acc.concat(value.join(" "));
  }, []);

  if (this._conjunction.length) {
    for (var i = 0; i < this._conjunction.length; i++) {
      var value = this._wrapSpace(this._conjunction[i]);
      if (joinedArray.length >= 2) {
        var firstArray = joinedArray.splice(0, 2);
        var joined = firstArray.join(value);
        joinedArray.unshift(joined);
      }
    }
  }

  if (_.isArray(joinedArray)) {
    this._whereClause = _(joinedArray).first();
  }

  this._query.where = this._whereClause;

  if (_.isArray(this._outFields)) {
    this._outFields = this._outFields.join(",");
    this._query.outFields = this._outFields;
  }

  if (this._orderByFields) {
    this._query.orderByFields = this._orderByFields;
  }

  if(this._returnCountOnly){
    this._query.returnCountOnly = this._returnCountOnly;
  }

  return this._query;

};

module.exports = QueryBuilder;
