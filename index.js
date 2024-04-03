const { json } = require('body-parser');
const { log } = require('console');
const express=require('express')
const fs=require('fs')

let app=express();

let records=JSON.parse(fs.readFileSync('./data/records.json'));

app.use(express.json())
//Get

app.get('/api/records',(req,res)=>{
    res.status(200).json({
        status:"sucess",
        count:records.length,  
        data:{
            records:records
        }
    });
});

//Post

app.post('/api/records',(req,res)=>{
    // console.log(req.body);
    const newID=records[records.length-1].id+1;
    
    const newRecord=Object.assign({id: newID},req.body)
    records.push(newRecord);

    fs.writeFile('./data/records.json',JSON.stringify(records),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                records:newRecord
            }
        })
    })
    // res.send('Created')

})


app.put('/api/records/:id',(req,res)=>{
    let prevData=records;
    let recID=req.params.id;
    let newRecID=parseInt(recID);
    if(isNaN(newRecID) || newRecID<1 || newRecID> records.length){
        return res.status(400).json({error:'Invalid request'});
    }
    prevData[recID-1]=req.body;
    prevData[recID-1]=Object.assign(
        {id:newRecID},
        prevData[recID-1]
    );

    let stringifyData=JSON.stringify(records);
    fs.writeFile('./data/records.json',stringifyData,()=>{
        res.json({
            status:"edited",
            data:prevData[recID-1],
        });
    });
});
    

const port= 3000;
app.listen(port,()=>{
    console.log('Server has started...');
})

