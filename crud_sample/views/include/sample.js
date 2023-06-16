function a(x) {

    let str=[]
    for(i=x.length;i>=0;i--){
     str +=  str.push(x[i])
    }

    if(x==str){
        console.log("true")
    }else{
        console.log("false")
    }


    
};


a(121)