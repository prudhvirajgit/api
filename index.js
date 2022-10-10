const { request } = require('express');
const express = require('express')
const app = express()
const port = 4000;
app.use(express.json());




 
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "crm"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});




app.post("/loginapi", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;


    let sql = "select id from tblusers";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
        res.send("Success" + JSON.stringify(result))
    });
});


app.post("/signupapi", (req, res) => {
    console.log(req)
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    let repassword = req.body.repassword;

    let sql =
        "SELECT txtFirstName,txtEmail FROM tblusers where txtEmail='" + email + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);

        if ((email != "") & (firstname != "")) {
            if (result != "") {
                res.send("user already exist please login" + JSON.stringify(result));
            } else {
                let sqlinsert = "insert into tblusers(txtFirstName,txtLastName,txtEmail,txtPassword) values('" + firstname + "','" + lastname + "','" + email + "','" + password + "') ;";
                con.query(sqlinsert, function (err, result1) {
                    if (err) throw err;
                    console.log("inserted" + result1);
                    res.send("user added")

                });
            }
        } else {
            res.send("email and firstname mandatory");
        }
    });
});

app.post("/verifyotpapi", (req, res) => {
      let otp = req.body.otp;
     let sql = "select txtOTP,dtOTPsent from tblusers where txtOTP='" + otp + "'";
     con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
       if (result == "") {
          res.send("OTP ERROR");
          return res
        }
        con.query(sql, function (err, result1) {
          if (err) throw err;
          console.log("sent" + result1);
          if (otp == "") {
            res.send("Incorrect");
          }
          else {
            res.send("Valid" + JSON.stringify(result));
          }

       });
    });
    })


    ///resend
  app.post("/resendapi", (req, res) => {
    let email = req.body.email;
    let otp = req.body.otp;
  
    let sql = "SELECT id FROM crm.tblusers where txtOTP='" + otp + "' and txtEmail='"+ email +"';";
  
    ;
    con.query(sql, function (err, result) {
      console.log(result);
      if (err) throw err;
      console.log(result);
      if (result != "") {
        res.send("verified!!!");
      }
      else  {
        res.send("resend!!!");
      }
     
    });
  });

  ////getsingleprofile
  app.post("/getsingleprofile", (req, res) => {
    let email = req.body.email;
    let sql = "select txtFirstName,txtLastName,txtEmail,txtPhonenumber from tblusers where txtEmail = '" + email + "';"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("result")
      if (result != "") {
        res.send("result " + JSON.stringify(result))
      }
      else {
        res.send("Does Not Exist")
      }
    });
  });

  app.post("/insertsingleprofile", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let dob = req.body.dob;
    let address = req.body.address;
    let password = req.body.password;
    let repassword = req.body.repassword;
    let sql = "select txtEmail from tblusers where txtEmail =  '" + email + "';"
    let sql1 = "insert into tblusers(txtFirstName,txtLastName,txtEmail,txtdob,txtAddress,txtPassword) values ('" + firstname + "','" + lastname + "','" + email + "','" + dob + "','" + address + "','" + password + "');"
    if (firstname == "") {
      res.send("Firstname is empty")
      return
    }
    if (lastname == "") {
      res.send("Lastname is empty")
      return
    }
    if (email == "") {
      res.send("Email is empty")
      return
    }
    if (dob == "") {
      res.send("Date of birth is empty")
      return
    }
    if (address == "") {
      res.send("Address is empty")
      return
    }
    if (password == "") {
      res.send("Password is empty")
      return
    }
    if (repassword == "") {
      res.send("Repassword is empty")
      return
    }
    if (password != repassword) {
      res.send("Password's do not match")
      return
    }
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result = " + JSON.stringify(result))
      if (result != "") {
        res.send("Profile already exists!")
        return
      }
      else {
        con.query(sql1, function (err, result) {
          if (err) throw err;
          res.send("Profile Inserted!")
          console.log("New user profile details inserted")
          return
        });
      }
    });
  });

app.post("/InsertSingleCampaign", (req, res) => {
    let CampaignName = req.body.CampaignName;
    let ParentCampaignName = req.body.ParentCampaignName;
    let Status = req.body.Status;
    let Startdate = req.body.Startdate;
    let Enddate = req.body.Enddate;
    let Responses = req.body.Responses;
    let CampaignOwner = req.body.CampaignOwner;
    let sqlinsert =
      "insert into tblcampaignlist (CampaignName,ParentCampaignName,Status,Startdate,Enddate,Responses,CampaignOwner) VALUES('" +
      CampaignName +
      "','" +
      ParentCampaignName +
      "','" +
      Status +
      "','" +
      Startdate +
      "','" +
      Enddate +
      "','" +
      Responses +
      "','" +
      CampaignOwner +
      "');";
    if (CampaignName == "") {
      res.send("CampaignName is mandatory");
      return res;
    }
    if (ParentCampaignName == "") {
      res.send("ParentCampaignName is mandatory");
      return res;
    }
    if (Startdate == "") {
      res.send("Startdate is mandatory");
      return res;
    }
    if (Enddate == "") {
      res.send("Enddate is mandatory");
      return res;
    }
    if (CampaignOwner == "") {
      res.send("CampaignOwner name is mandatory");
      return res;
    }
  
    con.query(sqlinsert, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.send("1 record inserted");
    });
  });

// app.get("/", (req, res)=>{
//     res.send("Test")
// })



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});










































// const express = require('express')
// const app = express()
// const port = 4000;
// app.use(express.json());

// app.get("/", (req, res)=>{
//     res.send("hi")
// })

// app.get("/sampleapi",(req, res)=>{
//     res.send("Sample API")
// })

// app.get("/b",(req, res)=>{
//     res.send("bye")
// })

// app.post("/addition",(req, res)=>{
//     let a=req.body.numone;
//     let b=req.body.numtwo;
//     let sum=a+b;
//     res.send("Result="+sum)
// })


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });