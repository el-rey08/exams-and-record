const express = require('express')
const dotenv =require('dotenv').config()
const port = process.env.port
const app = express()
const mongoose = require('mongoose')
app.use(express.json())
mongoose.connect(process.env.db).then(()=>{
console.log('connection successful')
app.listen(port,()=>{
    console.log(`server runinnig on port ${port}`)
    })
}).catch((err)=>{
 console.log('connection failed'+err.message)
})

app.get('/',(req,res)=>{
    res.status(200).json('welcome to mongoDB')
})
const date = new Date()
const scoreSchema = new mongoose.Schema({
    firstName:{type:String,required:[true,'kindly fillin your first name']},
    lastName:{type:String,required:[true,'kindly fillin your last name']},
    birthYear:{type:Number,required:[true,'birth year is required']},
    age:{type:String},
    sex:{type:String,enum:['male','female']},
    state:{type:String,required:[true,'state is required']},
    subjects:{type:Array,required:[true,'kindly fill your subject']},
    scores:{type:Object,required:[true,'kindly fii the score']},
    total:{type:Number},
    isPassed:{type:Boolean,default:function(){
        if (this.total<200) {
            return false
        } else {
            return true
        }
    }}
},{timestamps:true})

const scoreModel = mongoose.model('EXAM SCORE',scoreSchema)
app.post('/createuser',async(req,res)=>{
    try {
        const{firstName,lastName,birthYear,sex,state,subjects,scores}=req.body
        
        await new scoreModel(data)
        if(subjects.includes(subjects.keys(scores[0]))&& subjects.includes(subjects.keys(scores[1]))&& subjects.includes(subjects.keys(scores[2]))&& subjects.includes(subjects.keys(scores[3]))){
            return res.status(400).json('scores column doesnt match with the subject provided')
        }else{
            const data={firstName,
                lastName,
                birthYear,
                sex,
                state,
                subjects,
                age:data.getFullYear()-birthYear,
                scores,
                total:Object.values(scores).reduce((a,b)=>{
                    return a+b
                }),
            } 
            if(data.age<18){return res.status(400).json('you cannot register for this exam')}
            const newData=await scoreModel.create(data)
            res.status(201).json({
                message:`new user creatd`,
                newData
            })
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
})
app.get('/getall',async(req,res)=>{
 try {
    const allStudent = await scoreModel.find()
    res.status(200).json({
        message:'find all student in this database',
        allStudent
    })
 } catch (error) {
    res.status(500).json(error.message)
 }
})
// test running
//get all students
app.get('/getallstudents',async(req,res)=>{
    try {
    const getAll = await scoreModel.find()
    res.status(200).json({message: `Kindly find the ${getAll.length} registered students below:`,
    data: getAll})
    } catch (e) {
        res.status(500).json(e.message)
    }
})

//get one by id
app.get('/getuser/:id',async(req,res)=>{
    try {
     let ID = req.params.id
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const getOne = await scoreModel.findById(ID)
    if (!getOne) {
        return res.status(400).json(`User with ${ID} not found.`);
      } else {
    res.status(200).json({message: `Kindly find the student with ID: ${ID} below`,
    foundUser: getOne})
      }
    } catch (e) {
        res.status(500).json(e.message)
    }
})

app.get(`/:status`,async(req,res)=>{
    try {
        let status = req.params.status.toLowerCase() === 'true'
    const getStatus = await scoreModel.find({IsPassed:status})
        if (status == true) {
            res.status(200).json({message: `Kindly find the ${getStatus.length} successful students below:`, getStatus})
        } else if(!status == true) {
            res.status(200).json({message: `Kindly find the ${getStatus.length} unsuccessful students below:`, getStatus})
        }
    } catch (e) {
        res.status(500).json(e.message)
    }

})

// update user
app.put('/updateuse/:id',async(req,res)=>{
    try {
        let userId=req.params.id
        let {yb,subjects,scores}=req.body
        let data ={
            birthYear:yb,
            age:data.getFullYear()-yb,
            subjects,
            scores,
            total:Object.values(scores).reduce((a,b)=>{
                return a+b
            })
        }
        if (data.total<200) {
            data.isPassed=false
        } else {
            data.isPassed=true
        }
        if(subjects.includes(subjects.keys(scores[0]))&& subjects.includes(subjects.keys(scores[1]))&& subjects.includes(subjects.keys(scores[2]))&& subjects.includes(subjects.keys(scores[3]))){
            return res.status(400).json('scores column doesnt match with the subject provided')
        }else{
            const updatedUser = await scoreModel.findByIdAndUpdate(userId,data,{new:true})
            res.status(200).json({
                message:`${updatedUser.firstName} infomation has been successfully updated`,
                data:updatedUser
            })
        }
        
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})

app.put('/updateInfo/:id',async(req,res)=>{
    try {
        const {firstName,lastName,state,sex}=req.body
        let firstletter=firstName.charAt(0).toUpperCase()
        let remainingChar = firstName.slice(1).toLowerCase()
        let allTogether = firstletter.concat(remainingChar)
        let firstletter2=lastName.charAt|(0).toUpperCase()
        let remainingChar2 = lastName.slice(1).toLowerCase()
        let allTogether2 = firstletter2.concat(remainingChar2)
        let firstletter3 = state.charAt(0).toUpperCase()
        let remainingChar3 = state.slice(1).toLowerCase()
        let allTogether3 = firstletter3.concat(remainingChar3)

        const userInfo ={firstName:allTogether,
            lastName:allTogether2,
            state:allTogether3,
            sex
        }
        if(userInfo.sex !=='male' && userInfo.sex !=='female'){
            return res.status(400).json('sex can only be male or female')
        }
         let updatedUserInfo = await scoreModel.findByIdAndUpdate(req.params.id,userInfo,{new:true})
         res.status(200).json({
            message:`${updatedUserInfo.firstName} information has been succecsuffly updated`,
            userInfo:updatedUserInfo
         })
    } catch (error) {
        res.status(500).json(error.message)
    }
})
