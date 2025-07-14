// utils/validate.js
const validator = require("validator");

const validateUserData = (data) => {
  const mandatoryFields = ["name", "email", "password"];
  const missingFields = mandatoryFields.filter((key) => !data[key]);

  if (missingFields.length > 0) {
    return { valid: false, message: "Some field(s) are missing" };
  }

  if (!validator.isEmail(data.email)) {
    return { valid: false, message: "Invalid email format" };
  }

  if (
    !validator.isStrongPassword(data.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return { valid: false, message: "Password is not strong enough" };
  }

  return { valid: true };  //if everything passed
};

module.exports = validateUserData;




















// const validator = require("validator");

// // req.body

// const validate = (req,res,data) => {
//   const mandatoryField = ["name", "email", "password"];

//   const IsAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

//   if (!IsAllowed){
//     return res.json({message:"Some Filed is Missing"})
//   }  

//   if (!validator.isEmail(data.email)){
//     return res.json("Invalid Email")
//   } 

//   if(!validator.isStrongPassword(data.password,
//     {
//       minLength: 8,
//       minLowercase: 1,
//       minUppercase: 1,
//       minNumbers: 1,
//       minSymbols: 1,
//     })
//   ){
//     return res.json({message:"Enter strong password"});
//   }
     
// };

// module.exports = validate;
