/**
 *  Variable Verify library for browser
 *  @date 2015-1-6
 */

var _ = require('underscore'); // for Node.js test
var mathjs = require('mathjs');

var mod = require('./verify-var');

function test_cases(callback, trues, falses, nodef){
    var false_exps = !nodef?[Infinity, undefined, null, -Infinity, NaN,
        '','abc', '123.abc','234adfa',
        [234], {}, {'a':2342,1:2}, function(){} ] : [];
    var true_exps = !nodef?[123]:[];

    var run = function(cases, value ){
        _.map(cases, function(v){
            var ret = callback(v) ;
            console.log('Case:', v ,', Result:', ret );
            var msg = ['Case[' ,v , '] failed, ',
                    'Should be ->', String(value), ', ',
                    'Got Result ->', String(ret)].join('') ;
            console.assert( ret === value, callback.name + ',' + msg );
        });
    };

    if( arguments.length > 1 ){
        true_exps = true_exps.concat(trues);
        if( arguments.length > 2 ){
            false_exps = false_exps.concat(falses);
        }
    }

    console.log('\n======\nnow run: ',callback.name);
    run(true_exps, true);
    run(false_exps, false);
}

//test_cases(mod.verify_float,['789.0', '456.123', 123.456]);
//test_cases(mod.verify_percent,['102%', 0.12, 3, 3.56], ['123', '123.1', '456.0']);
//test_cases(mod.verify_int,['458', '789.000',3.0 ], ['0.12',  '456.123','102%', 0.12, 3.56]);
//test_cases(mod.verify_variable_name,['_a','a','abc'],['','-','_','123','中文'],'NoDefault');
test_cases(mod.verify_expression,['60%+2/3*6-a+c+t[1,2]+b[1,1]',''],['a[1][2]','a+b+fun(])','a[1]+a()'], 'NoDefault');