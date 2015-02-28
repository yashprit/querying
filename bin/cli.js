#!/usr/bin/env node
'use strict';
var meow = require('meow');
var httpQueryBuilder = require('./');

var cli = meow({
  help: [
    'Usage',
    '  http-query-builder <input>',
    '',
    'Example',
    '  http-query-builder Unicorn'
  ].join('\n')
});

httpQueryBuilder(cli.input[0]);
