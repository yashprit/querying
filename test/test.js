'use strict';
var QueryBuilder = require("../lib");
var expect = require("chai").expect;
var assert = require("chai").assert;
var _ = require("underscore");

describe("Testing QueryBuilder Class", function() {
  var queryBuilder;

  beforeEach(function() {
    queryBuilder = QueryBuilder();
  });

  afterEach(function() {
    queryBuilder._col = [];
    queryBuilder._value = [];
    queryBuilder._operator = [];
    queryBuilder._conjunction = [];
    queryBuilder._orderByFields = "";
  });

  it("Should be exist", function() {
    expect(queryBuilder).to.be.exist;
  });

  describe("#QueryBuilder.where()", function() {

    it("Should except one argument", function() {
      queryBuilder.where("FIELD_ID");
      expect(queryBuilder._cols.length).to.equal(1);
    });

    it("Should not except two argument", function() {
      expect(queryBuilder.where.bind(queryBuilder, 'USER_ID', 123456)).to.throw("Missing no of arguments");
    });

    it("Should except 3 argument", function() {
      queryBuilder.where("USER_ID", 123, '=');
      expect(_(queryBuilder._cols).last()).to.equal("USER_ID");
    });

    it("Should not accept two immediate where clause", function() {
      queryBuilder.where("USER_ID", 123, '=');
      expect(queryBuilder.where.bind(queryBuilder, 'FILED_ID')).to.throw("Invalid query");
    })
  });

  describe("#QueryBuilder.outFields()", function() {

    it("should accept string as argument", function() {
      queryBuilder.outFields("*")
      expect(queryBuilder._outFields[0]).to.equal("*");
    });

    it("should accept comma seprated string", function() {
      queryBuilder.outFields("FILED_ID, USER_ID");
      expect(queryBuilder._outFields.length).to.equal(2);
    });

    it("should accept array", function() {
      queryBuilder.outFields(["FIELD_ID", "USER_ID"]);
      expect(queryBuilder._outFields.length).to.equal(2);
    });

    it("number is not allowed", function() {
      expect(queryBuilder.outFields.bind(queryBuilder, 123)).to.throw("Only String allowed");
    });
  });

  describe("#QueryBuilder.is()", function() {

    it("Should genrate statement based on key", function() {
      expect(queryBuilder.is.bind(queryBuilder, 123)).to.throw("No key found for value 123");
    });

    it("Should genrate statement based on key", function() {
      queryBuilder.where("FIELD_ID").is(12345)
      expect(_(queryBuilder._value).last()).to.equal('\'12345\'');
    });

    it("Should generate statement with =", function() {
      queryBuilder.where("FIELD_ID").is(123);
      expect(_(queryBuilder._cols).last()).to.equal("FIELD_ID");
    });

  });

  describe("#QueryBuilder.isNot()", function() {

    it("Should genrate statement based on key", function() {
      expect(queryBuilder.isNot.bind(queryBuilder, 123)).to.throw("No key found for value 123");
    });

    it("Should genrate statement based on key", function() {
      queryBuilder.where("FIELD_ID").isNot(12345)
      expect(_(queryBuilder._value).last()).to.not.equal('\'123\'');
    });

    it("Should generate statement with <>", function() {
      queryBuilder.where("FIELD_ID").isNot(123);
      expect(_(queryBuilder._operator).last()).to.equal(QueryBuilder.Operators.NOT_EQUAL);
    });

  });

  describe("#QueryBuilder.ASC()", function() {

    it("Should genrate statement based on key", function() {
      expect(queryBuilder.ASC.bind(queryBuilder)).to.throw("No column found for ASC");
    });

    it("Should generate statement based on key", function() {
      queryBuilder.ASC("ROLE");
      expect(_(queryBuilder._orderByFields).value()).to.equal("ROLE ASC");
    });

  });

  describe("#QueryBuilder.and()", function() {

    /*it("Should have two or four argument", function() {
      queryBuilder.where("FIELD_ID").is("123");
      var colsLength = queryBuilder._cols.length;
      var valueLength = queryBuilder._value.length;
      var totalLength = colsLength + valueLength;
      expect(totalLength).to.equal(2);
    });*/

    it("Should not accept without preceding where", function() {
      expect(queryBuilder.and.bind(queryBuilder)).to.throw("Invalid query");
    });

    it("Should not accept without one preceding operator", function() {
      queryBuilder.where("FIELD_ID");
      expect(queryBuilder.and.bind(queryBuilder)).to.throw("Invalid query");
    });

    it("Should accept one argument", function() {
      queryBuilder.where("FIELD_ID").is(123).and("USER_ID");
      expect(_(queryBuilder._cols).last()).to.equal("USER_ID");
    });

    it("Should not accept two argument", function() {
      queryBuilder.where("FIELD_ID").is(123);
      expect(queryBuilder.and.bind(queryBuilder, "USER_ID", 1234)).to.throw("Missing no of arguments");
    });

    it("Should accept three argument", function() {
      queryBuilder.where("FIELD_ID").is(123).and("USER_ID", 1234, '=');
      expect(_(queryBuilder._cols).last()).to.equal("USER_ID");
    });

    it("Should match 1 conjuctions length ", function() {
      queryBuilder.where("FIELD_ID").is("12345").and("USER_ID").is("123");
      expect(_(queryBuilder._conjunction.length).value()).to.equal(1);
    });

    it("Should match 2 conjuctions length ", function() {
      queryBuilder.where("FIELD_ID").is("12345").and("USER_ID").is("123").and("USER_ID").is("123");
      expect(_(queryBuilder._conjunction.length).value()).to.equal(2);
    });

  });

  describe("#QueryBuilder.grtThan()", function() {

    it("Should not accept without argument", function() {
      expect(queryBuilder.grtThan.bind(queryBuilder)).to.throw("Missing argument");
    });

    it("Should not generate statement without key", function() {
      expect(queryBuilder.grtThan.bind(queryBuilder, 10)).to.throw("No key found for value 10");
    });

    it("Should generate statement based on key", function() {
      queryBuilder.where('CROP_YEAR').lessThan(2013);
      expect(_(queryBuilder._cols).last()).to.equal("CROP_YEAR");
    });

    it("Should generate statement with " + QueryBuilder.Operators.GREATER, function() {
      queryBuilder.where('CROP_YEAR').grtThan(2013);
      expect(_(queryBuilder._operator).last()).to.equal(QueryBuilder.Operators.GREATER);
    });
  });

  describe("#QueryBuilder.lessThan()", function() {

    it("Should not accept without argument", function() {
      expect(queryBuilder.lessThan.bind(queryBuilder)).to.throw("Missing argument");
    });

    it("Should not generate statement without key", function() {
      expect(queryBuilder.lessThan.bind(queryBuilder, 2014)).to.throw("No key found for value 2014");
    });

    it("Should generate statement based on key", function() {
      queryBuilder.where('CROP_YEAR').lessThan(2014);
      expect(_(queryBuilder._cols).last()).to.equal("CROP_YEAR");
    });

    it("Should generate statement with " + QueryBuilder.Operators.LESS, function() {
      queryBuilder.where('CROP_YEAR').lessThan(2014);
      expect(_(queryBuilder._operator).last()).to.equal(QueryBuilder.Operators.LESS);
    });
  });

  describe("#QueryBuilder.grtThanAndEqual()", function() {

    it("Should not accept without argument", function() {
      expect(queryBuilder.grtThanAndEqual.bind(queryBuilder)).to.throw("Missing argument");
    });

    it("Should not generate statement without key", function() {
      expect(queryBuilder.grtThanAndEqual.bind(queryBuilder, 2312)).to.throw("No key found for value 2312");
    });

    it("Should generate statement based on key", function() {
      queryBuilder.where('FARM_ID').grtThanAndEqual(2312);
      expect(_(queryBuilder._cols).last()).to.equal("FARM_ID");
    });

    it("Should generate statement with " + QueryBuilder.Operators.GREATER_EQUAL, function() {
      queryBuilder.where('FARM_ID').grtThanAndEqual(2232);
      expect(_(queryBuilder._operator).last()).to.equal(QueryBuilder.Operators.GREATER_EQUAL);
    });
  });

  describe("#QueryBuilder.lessThanAndEqual()", function() {

    it("Should not accept without argument", function() {
      expect(queryBuilder.lessThanAndEqual.bind(queryBuilder)).to.throw("Missing argument");
    });

    it("Should not generate statement without key", function() {
      expect(queryBuilder.lessThanAndEqual.bind(queryBuilder, 2012)).to.throw("No key found for value 2012");
    });

    it("Should generate statement based on key", function() {
      queryBuilder.where('CROP_YEAR').lessThanAndEqual(2012);
      expect(_(queryBuilder._cols).last()).to.equal("CROP_YEAR");
    });

    it("Should generate statement with " + QueryBuilder.Operators.LESS_EQUAL, function() {
      queryBuilder.where('CROP_YEAR').lessThanAndEqual(2012);
      expect(_(queryBuilder._operator).last()).to.equal(QueryBuilder.Operators.LESS_EQUAL);
    });
  });

  describe("#QueryBuilder.isNull()", function() {
    it("Should not generate statement with argument", function() {
      expect(queryBuilder.where('CROP_YEAR').isNull());
    });

  });

  describe("#QueryBuilder.isNotNull()", function() {
    it("Should not generate statement with argument", function() {
      expect(queryBuilder.where('CROP_YEAR').isNotNull());
    });
  });

  describe("#QueryBuilder.in()", function() {
    it("Should not accept without argument", function() {
      expect(queryBuilder.in.bind(queryBuilder)).to.throw("Missing argument");
    });

    it("Should not accept object as input", function() {
      expect(queryBuilder.in.bind(queryBuilder, {})).to.throw("Invalid input");
    });

    it("Should not generate statement without preceding where", function() {
      expect(queryBuilder.in.bind(queryBuilder, [12, 23, 34])).to.throw("No key found for value (\'12\',\'23\',\'34\')");
    });

    it("Should generate statement based on key", function() {
      queryBuilder.where("FIELD_ID").in([123, 145, 156]);
      expect(_(queryBuilder._cols).last()).to.equal("FIELD_ID");
    })
  });


  describe("#QueryBuilder.build()", function() {

    it("Should generate query object", function() {
      var query = queryBuilder.where("FIELD_ID").is("12345").and("USER_ID").is("123").and("USER_ID").is("12345").ASC("ROLE").build();
      var expected = {
        where: "FIELD_ID = '12345' AND USER_ID = '123' AND USER_ID = '12345'",
        orderByFields: "ROLE ASC"
      };
      expect(query).to.include(expected);
    });

  });

  describe("#QueryBuilder.or()", function() {

    it("Should not accept without preceding where", function() {
      expect(queryBuilder.or.bind(queryBuilder)).to.throw("Invalid query");
    });

    it("Should not accept without one preceding operator", function() {
      queryBuilder.where("USER_ID");
      expect(queryBuilder.or.bind(queryBuilder)).to.throw("Invalid query");
    });

    it("Should accept one argument", function() {
      queryBuilder.where("USER_ID").is(12356).or("ROLE");
      expect(_(queryBuilder._cols).last()).to.equal("ROLE");
    });

    it("Should not accept two argument", function() {
      queryBuilder.where("USER_ID").is(12356);
      expect(queryBuilder.or.bind(queryBuilder, "ROLE", 10)).to.throw("Missing no of arguments");
    });

    it("Should accept three argument", function() {
      queryBuilder.where("USER_ID").is(12356).or("ROLE", 10, '=');
      expect(_(queryBuilder._cols).last()).to.equal("ROLE");
    });

    it("Should match 1 conjunctions length ", function() {
      queryBuilder.where("FIELD_ID").is("12345").or("USER_ID").is("123");
      expect(_(queryBuilder._conjunction.length).value()).to.equal(1);
    });

    it("Should match 2 conjunctions length ", function() {
      queryBuilder.where("FIELD_ID").is("12345").or("USER_ID").is("123").or("USER_ID").is("123");
      expect(_(queryBuilder._conjunction.length).value()).to.equal(2);
    });

    it("Should generate query with OR conjunction", function() {
      queryBuilder.where("FIELD_ID").is("12345").or("USER_ID").is("123");
      expect(_(queryBuilder._conjunction).last()).to.equal(QueryBuilder.Operators.OR);
    });

  });

  describe("#QueryBuilder.returnCountOnly()", function() {
    it("Should set _returnCountOnly false, if method is not used", function() {
      expect(queryBuilder._returnCountOnly).to.false;
    });
    it("Should set _returnCountOnly true, if method is used", function() {
      queryBuilder.returnCountOnly();
      expect(queryBuilder._returnCountOnly).to.true;
    });
  });

  describe("#Query.stringify()", function() {
    it("Should set _returnCountOnly false, if method is not used", function() {
      var query = queryBuilder.where("FIELD_ID").is("12345").or("USER_ID").is("123").build();
      expect(query.stringify()).to.false;
    });
    it("Should set _returnCountOnly true, if method is used", function() {
      queryBuilder.returnCountOnly();
      expect(queryBuilder._returnCountOnly).to.true;
    });
  })

});
