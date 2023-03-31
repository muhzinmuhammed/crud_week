var UserDb=require('../model/model')

//create and save new user
exports.create=(req,res)=>{

    //validate request
    if (!req.body) {
        res.status(400).send({message:"Content can not be empty"});
        return
        
    }

    //new user

    const user=new UserDb({
        name:req.body.name,
        email:req.body.email,
        gender:req.body.gender,
        status:req.body.status,
        password:req.body.password
    })
    //save user in the database
    user.save(user)
    .then(data=>{
        // res.send(data)
        res.redirect('/add-user')
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message||"some error occured while creating a  create opreation"
        })
    })
   

}



//retrive and  new user

exports.find=(req,res)=>{

    if (req.query.id) {
        const id=req.query.id
        UserDb.findById(id)
        .then(data=>{
            if (!data) {
                res.status(400).send({message:"Data to update can note be empty"});
               

                
            }else{
                res.send(data)
            }
        })
        .catch(err=>{
            res.send(500).send({message:"Error user id"+id})
        })

        
    }else{

        UserDb.find()
        .then(user=>{
            res.send(user)
        })
        .catch(err=>{
            res.status.send({message:err.message||"error occured while user information"})
        })

    }


   
}


//update

exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    UserDb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}


//delete

exports.delete = (req, res) => {
    const id = req.params.id;

    UserDb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot delete user with ${id}. Maybe user not found.` });
            } else {
                res.send({ message: "User was deleted successfully!" });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error deleting user information " + id });
        });
};



