/**
 *  Variable Verify library for browser(AMD)
 *
 *  @date 2015-1-6
 */


// var _ = require('underscore'); // for Node.js (CMD/CJS)
// var mathjs = require('mathjs');

define(['mathjs','underscore'], function(mathjs, _ ){ // for requireJS
   var exports = {};

    // Key Words
    var keywords = ['False', 'None', 'True', 'and', 'as', 'assert', 'break',
        'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'exec',
        'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
        'nonlocal', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try',
        'while', 'with', 'yield',
        'case', 'catch', 'const', 'debugger', 'default', 'delete', 'do',
        'function', 'instanceof', 'let', 'new', 'switch', 'this', 'throw',
        'typeof', 'var', 'void'];

    var builtin_functions = ["discount","if"];

    // math expression handle
    
    /**
     * transform use expression to valid JavaScript expression
     * @param s
     * @returns {string}
     */
    function expr_transform(s){
        // for redefined %
        s = s.trim().replace(/(^|[\D])(\d+)%([\D]|$)/g,'$1$2*0.01$3') // replace 60%
        // for redefined function args
        s = s.replace(/;/g,',').replace(/=/g,'==');
        // [][] to [,]
        //s = s.replace(/\[]\s*,\s*(\d+)\s*\]/g, '[$1][$2]');
        return s ;
    }

    /**
     * according mathJS parsed result, obtain variables referred
     * @param expr
     * @returns {{expr: string, node: object, refs: {}}}
     */
    function gen_refs(expr){
        var s = expr_transform(expr);
        var parsed_node = mathjs.parse( s );
        // now parse nodes
        var ref_vars = {}, node_types = {'SymbolNode':1,'IndexNode':1,'FunctionNode':1};
        _.each(parsed_node.filter(function(node){
            return node.type in node_types ;
        }), function(item){
            var t = item.type;
            if( t =='SymbolNode') {
                if (!( item.name in ref_vars )){
                    ref_vars[item.name] = 'normal';
                }
            } else if (t == 'FunctionNode'){
                ref_vars[item.name] = 'function';
            } else if( t == 'IndexNode' ){
                if(item.object.type == 'SymbolNode' ){
                    ref_vars[item.object.name] = 'array' ;
                }
            }
        });
        var ret = {
            'expr': s,
            'node' : parsed_node,
            'refs' : ref_vars
        };
        return ret;
    }

    function fake_scope(refs){
        var bigarr = _.map(_.range(100), function(){return _.range(1,101)});
        var ret = {};
        _.map( refs, function(v, k){
            var r ;
            if( v == 'normal'){
                r = 1 ;
            } else if( v=='function'){
                r = function(){return 1;};
            } else {
                r = bigarr;
            }
            ret[k] = r ;
        });
        return ret ;
    }

    /**
     * check is a valid expression, return error
     * @param expr
     * @param scope
     * @returns {boolean} error
     */
    function fake_evaluate(expr, scope){
        var info ;
        try{
            info = gen_refs(expr);
        }catch(e){
            return e ;
        }
        var parsed = info['node'], refs = info['refs'];
        var faked = fake_scope(refs);
        if (scope){
            _.defaults(scope, faked);
        } else {
            scope = faked ;
        }
        //console.log(scope);
        var error = false ;
        try{
            parsed.compile(mathjs).eval(scope);
        }catch(e){
            error = e ;
        }
        return error ;
    }

    // API

    exports.expr_transform = expr_transform;
    exports.gen_refs = gen_refs ;
    exports.fake_scope = fake_scope;
    exports.fake_evaluate = fake_evaluate ;

    // Constants
    
    exports.GLOBAL_KEYWORDS = {} ;
    _.map(keywords, function(v){
        exports.GLOBAL_KEYWORDS[v.toLowerCase()] = 1 ;
    });

    _.map(builtin_functions, function(v){
        exports.GLOBAL_KEYWORDS[v.toLowerCase()] = 1 ;
    });

   return exports;
});

//fake_scope(gen_refs(expr_transform('a[1,2]+b[1][0]+discount(1;0;60%)'))['refs'])