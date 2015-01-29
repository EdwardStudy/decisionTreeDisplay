/**
 * middleware for TreeUtils
 *
 */

'use strict';

var ktree_getfirst = function(kt){
    if( kt.children.length > 0){
      return kt.children[0];
    }
    return false;
  };

var ktree_getlast = function(kt){
  if( kt.children.length > 0){
    return kt.children[kt.children.length-1];
  }
  return false;
};

var ktree_getnext = function(kt, allnodes){
  var cur = 0 ;
  if( kt.id in allnodes ){
    cur = allnodes[kt.id] + 1;
  }
  if( kt.children.length > cur ){
    allnodes[kt.id] = cur ;
    return kt.children[cur];
  }
  return false;
};

exports.pre_order_traversal = function(ktree, visitfun){
  var allnodes = {}, root = ktree, node_pre_orders=[];

  var stack = [root];
  var visited_nodes = {};
  var break_reason = false;
  var cur, last, n ;

  while( stack.length > 0){
    cur = stack.pop();

    if( cur.id in visited_nodes ){
      last = ktree_getlast(cur);
      if( last && !( last.id in visited_nodes ) ){
        stack.push(cur);
        n = ktree_getnext(cur, allnodes);
        if(n){
          stack.push(n);
        }
      }
    } else {
      node_pre_orders.push(cur);
      visited_nodes[cur.id] = 1;
      var ret = visitfun.call(cur,cur,root);
      if( ret && ret.toUpperCase() == 'STOP'){
        break_reason = 'VISITFUN STOP';
        break;
      }
      if( ktree_getlast(cur) ){
        stack.push(cur);
      }
    }
  }

  return node_pre_orders;
};

exports.ring_check = function(graph){
	
	
};

// generic require signin middleware
exports.post_order_traversal = function (ktree, visitfun) {
  var allnodes = {}, root = ktree, node_post_orders=[];

  var stack = [root];
  var visited_nodes = {};
  var break_reason = false;
  var cur, last, n;

  while( stack.length > 0){
    cur = stack.pop();
    last = ktree_getlast(cur)
    if( last == false || last.id in visited_nodes ){
      visited_nodes[cur.id] = 1;
      node_post_orders.push(cur);
      var ret = visitfun.call(cur,cur,root);
      if( ret && ret.toUpperCase() === 'STOP'){
        break_reason = 'VISITFUN STOP';
        break;
      }
    } else {
      stack.push(cur);
      n = ktree_getnext(cur, allnodes);
      if(n){
        stack.push(n);
      }
    }
  }

  return node_post_orders;

};