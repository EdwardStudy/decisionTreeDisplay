/**
 *  Variable Verify library for browser(AMD)
 *
 *  @date 2015-1-6
 */


// var _ = require('underscore'); // for Node.js (CMD/CJS)
// var expr_helper = require('./expr-helper');

define(['underscore', './expr-helper'], function( _, expr_helper ){ // for requireJS
   var exports = {};

   // Reserved Key Words (保留的关键字)
   var ReservedKeyWords = expr_helper.GLOBAL_KEYWORDS ;

    /**
     * normal float is true; Infinity, NaN are false
     * @param s number|string
     * @returns {boolean}
     */
    function verify_float(s){
        return (typeof  s != 'object') && (s - parseFloat( s ) + 1) >= 0;
    }

    /**
     * number is true; string without % is false
     * @param s number|string
     * @returns {boolean}
     */
    function verify_percent(s){
        var stype = typeof s;
        if( stype == 'string' ){
            return s.slice(-1) == '%' && verify_float(s.slice(0,-1));
        }
        return stype == 'number' && verify_float(s);
    }

    /**
     * string like '123.0' is true; NaN, Infinity are false
     * @param s number|string
     * @returns {boolean}
     */
    function verify_int(s){
        return (typeof  s != 'object') && s - parseInt(s) + 1 === 1 ;
    }

    /**
     * check variable name is valid
     * @param name
     * @returns {boolean} true is Ok , false is a bad variable name
     */
    function verify_variable_name(name){
        var ret = /^[_a-zA-Z]\w{0,63}$/.test(name) && name != '_' ;
        return ret ? ((name in ReservedKeyWords )?false:true) : false ;
    }

    function verify_expression(exp, variables){
        if( /\[[^,]*\]/g.test(exp) ){ // only support table/matrix operate a[1,1]
            return false ;
        }
        if( expr_helper.fake_evaluate(exp, variables) ){
            //console.log(err);
            return false ;
        } else {
            return true ;
        }
    }

    function verify_table(table, onlyInteger){
        var verify_fun = !!onlyInteger ? verify_int : verify_float;
        if(_.isArray(table) && table.length > 0){
            var collen = table[0].length ;
            for(var i=1;i>=0;i--){
                if ( !(table[i].length == collen && _.all(table[i], verify_fun) )){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    // API
    exports.verify_float = verify_float;
    exports.verify_int = verify_int;
    exports.verify_percent = verify_percent;
    exports.verify_variable_name = verify_variable_name;
    exports.verify_expression = verify_expression;
    exports.verify_table = verify_table;

    // Constants
    exports.ReservedKeyWords = ReservedKeyWords;
   return exports;
});

