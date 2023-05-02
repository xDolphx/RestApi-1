const express = require("express")
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());

let patients = new Object();
patients["214-22-1111"] = ["Bill", "Williams", "424-444-1356"]
patients["243-11-2222"] = ["Ryan", "Logan", "412-888-9203"]

let records = new Object();
records["214-22-1111"] = "Status: Sickly"
records["243-11-2222"] = "Status: Healthy"

//Get patient medical records
app.get("/records", (req, res) => {

    //Verify Patient Exist 
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return
    }
    //Verify SSN matches First and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && 
        req.headers.lastname == patients[req.headers.ssn][1]){
            if (req.body.reasonforvisit === "medicalrecords") {
                //return medical records 
                res.status(200).send(records[req.headers.ssn])
                return;
            }
            else {
                //return error
                res.status(501).send({"msg":"Unable to complete request at this time:"})
            }
 //first last and ssn match 
}
else{
    res.status(403).send({"msg":"first or last name didn't match SSN"})
}


    // Return the correct record
    res.status(200).send({"msg": "HTTP GET - SUCCESS!"});
});

//Create a new patient 
app.post("/", (req, res) => {
    //Create new patient in database 
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.ssn, req.headers.phone]
    res.status(200).send(patients)
});

//update existing patient phone number 
app.put("/", (req, res) => {

    //Verify Patient Exist 
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return
    }    
    if (req.headers.firstname == patients[req.headers.ssn][0] && 
        req.headers.lastname == patients[req.headers.ssn][1]){
           // Update the phone number and return patient info
            patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phone]      
            res.status(200).send(patients[req.headers.ssn])
            return;
        }  
else {
    res.status(403).send({"msg":"first or last name didn't match SSN (trying to update phone number)"})
    return;
}
    //make sure phone number is accurate 

    res.status(200).send({"msg": "HTTP PUT- SUCCESS!"})
});

//Delete information
app.delete("/", (req, res) => {
    
  //Verify Patient Exist 
  if (records[req.headers.ssn] === undefined) {
    res.status(404).send({"msg":"Patient not found"})
    return
}
//Verify SSN matches First and last name
if (req.headers.firstname == patients[req.headers.ssn][0] && 
    req.headers.lastname == patients[req.headers.ssn][1]){
    //Delete patient and medical records from database 

    delete patients[req.headers.ssn]
    delete records[req.headers.ssn]

    res.status(200).send({"msg": "Sucessfully deleted"});
    return;
}
else{
res.status(403).send({"msg":"first or last name didn't match SSN (Attempting to delete)"})
}
    res.status(200).send({"msg": "HTTP DELETE - SUCCESS!"})
});

app.listen(3000);