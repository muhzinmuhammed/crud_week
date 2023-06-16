 function a(nums) {

    let c=[]

    let d=0

    for(i=0;i<nums.length;i++){
      d+=nums[i]
      c.push(d)
    }
    return c
};


console.log(a([1,2,3,4]));