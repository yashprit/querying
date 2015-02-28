#!/usr/bin/env node
'use strict';
var meow = require('meow');
var querying = require('./');

var cli = meow({
  help: [
    'Usage',
    '  querying <input>',
    '',
    'Example',
    '  querying Unicorn'
  ].join('\n')
});

querying(cli.input[0]);
