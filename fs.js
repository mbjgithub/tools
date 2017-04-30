var fs=require('fs')
var path=require('path')
var http=require('http')

http.createServer(function(req,res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(JSON.stringify(readDir('E:/jsnode/Blog')))
    res.end()  
}).listen(1337,"127.0.0.1",function(err){
     if(!err) console.log('server is running in 127.0.0.1:1337')
})

function readDir(entry){
	 var final=[]
     var res=[]
     var curr=fs.readdirSync(entry,'utf8')||[]
     var fullPath,temp,obj;
     for(var i=0,len=curr.length;i<len;i++){
     	temp=curr[i]
     	obj={}
         fullPath=path.join(entry,temp)
         if(fs.statSync(fullPath).isFile()){
         	 obj[temp]=[]
             res.push(obj)
         }else{
         	obj[temp]=readDir(fullPath)
         	res.push(obj)
         }
     }
     obj={}
     obj[entry]=res
     final.push(obj)
     return final
}

// console.log(readDir('E:/jsnode/Blog'))