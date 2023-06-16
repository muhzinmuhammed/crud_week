function c() {

    var q=10

    function b(str) {
        let x=5
       

        function a() {

            console.log(x,q,str);

            
            
        }
        return a
    }
    return b
    
}
  let q=100

console.log(q)
c()("Hello")()
