/**
 * 思想：其实实现双向的数据绑定的一种方法是重新定义对象的属性，在对象属性的set方法中
 * 我们触发某一个事件，来告诉外界这个变量的值发生了改变
 */
/*
下面先介绍一下Object.defineProperty方法，这个方法是实现双向数据绑定的基础
描述属性的对象有两种，分别是数据描述符(data descriptor)和存取描述符(accessor descriptor)
描述属性只能是两种描述符中的一种，下面是他们所拥有的属性
数据描述符：
   configurable
   enumerable
   value
   writable
存取描述符：
   configurable
   enumerable
   get
   set
示例:
Object.defineProperty(obj,key,{
     configurable:true,   //表示该属性可以被delete运算符删除,默认false
     enumerable:true,     //表示该属性可以被for in遍历,默认false
     value:"wangwang",    //表示属性值,默认undefined
     writable:true        //表示属性值可以被修改,默认false
})

Object.defineProperty(obj,key,{
     configurable:true,   //表示该属性可以被delete运算符删除,默认false
     enumerable:true,     //表示该属性可以被for in遍历,默认false
     get:function(){ return obj[key] },    //获取属性值时要调用的方法,默认undefined
     set:function(newValue){ obj[key]=newValue } //设置属性值时要调用的方法，默认undefined
})
*/
var fn={
	queue:{},
	type:function(obj){
        var origin=Object.prototype.toString.call(obj).match(/\[\s*object\s*(\w+)\s*\]/)||[]
        return origin[1]&&origin[1].toLowerCase()||undefined
	},
	objEach:function(obj,fn){
	    if(!obj) return
	    for(var key in obj){
		  if(obj.hasOwnProperty(key)){
			if(fn(key,obj[key])===false) break 
		  }
	    } 
    },
    keys:function(obj){
       if(!obj) return []
       if(Object.keys) return Object.keys(obj)
       var keys=[]
       this.objEach(obj,function(key,value){
            keys.push(key)
       })
       return keys
    },
    on:function(event,cb){
    	if(this.type(cb)!='function') throw new TypeError('cb must be a function')
        if(!this.queue[event]){
        	this.queue[event]=[]
        }
        this.queue[event].push(cb)
    },
    emit:function(event){
        var args
    	if(this.queue[event]){
    		args=[].slice.call(arguments,1)
            this.objEach(this.queue[event],function(key,value){
                 value&&value.apply(null,args)
            })
    	}
    },
    redefineProperty:function(obj){
    	var that=this
    	if(typeof obj!='object'){
    		obj={randomName:obj}
    	}
        this.objEach(obj,function(key,value){
        	Object.defineProperty(obj,key,{
        	    configurable:true,
        	    enumerable:true,
        	    get:function(){
        	    	return value
        	    },
        	    set:function(newValue){
                    value=newValue
                    that.emit(key,key+" attribute,value changed")
        	    }
        	})
        })
    },
    onKeyEvent:function(obj){
    	var that=this
    	this.objEach(obj,function(key,value){
             that.on(key,function(){
             	console.log(arguments)
             })
    	})
    }
}

var obj={
	name:"wangwang",
	age:18
}
fn.onKeyEvent(obj)
fn.redefineProperty(obj)
obj.name="miaomiao"    //name's value chnaged
