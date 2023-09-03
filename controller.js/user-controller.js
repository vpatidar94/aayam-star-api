const User = require("../model/User")

// 
const { generateToken, verifyToken } = require('../middleware/jwt-token');
// const fetchIdByToken = require('../services/token');

// const getAllUsers = async (req, res, next) => {
//     let users = ''
//     try {
//         users = await User.find();
//     } catch (err) {
//         return next(err)
//     }

//     if(!users){
//         return res.status(500).json({ code: "error",  message: "Internal Server Error"});
//     }

//     return res.status(200).json({data: users, code: "success", message: "Data fetched successfully."})
// }

const addUpdateUser = async (req, res) => {
  try {
    const mobileNo = req.body.mobileNo;

    if (!mobileNo) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const user = await User.findOne({ mobileNo: mobileNo });

    if (!user) {
      return addNewUser(req, res)
    }

    const token = generateToken(user._id, user.mobileNo)
    return res.status(200).json({ data: { token, user, isNew: false }, code: 200,  status_code: "success", message: "User updated successfully." })

  } catch (error) {
    res.status(500).json({ code: 500,  status_code: "error", error: 'An error occurred while updating the mobile number' });
  }
}

const addNewUser = async (req, res) => {
  const { mobileNo } = req.body;

  if ((!mobileNo)) {
    return res.status(400).json({ code: 400,  status_code: "error", message: "Mobile number is required." })
  }

  try {
    const newUser = new User({
      mobileNo,
      isVerified: true
    })
    await newUser.save();
    const token = generateToken(newUser._id, newUser.mobileNo)

    return res.status(201).json({ data: { token, user: newUser, isNew: true }, code: 200,  status_code: "success", message: "User added successfully." })
  } catch (error) {
    res.status(500).json({ code: 500,  status_code: "error", error: 'Enter correct mobile number' });
  }
}

const addUser = async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name && name.trim() === "") || (!email && email.trim() === "") || (!password && password.trim() === "")) {
    return res.status(422).json({ code: 422,  status_code: "error", message: "Invalid data." })
  }

  try {
    const newUser = new User({
      name, email, password
    })
    await newUser.save();
    return res.status(201).json({ data: newUser, code: 200,  status_code: "success", message: "User added successfully." })
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (unique constraint violation)
      res.status(400).json({ code: 400, status_code: "error", error: 'Username or email already exists' });
    } else {
      res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while registering the user' });
    }
  }
}

const updateName = async (req, res) => {
  try {
    const { mobileNo } = req.user;
    const { name, stream } = req.body;

    if (!name) {
      return res.status(400).json({ code: 400, status_code: "error", error: 'Name number is required' });
    }

    const user = await User.findOneAndUpdate(
      { mobileNo: mobileNo },
      { name, stream },
    );
    if (!user) {
      return res.status(404).json({ code: 404, status_code: "error", error: 'User not found' });
    }

    return res.status(200).json({ data: user, code: 200,  status_code: "success", message: "Name updated successfully." })

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while updating the name' , err: error});
  }
}

const addScore = async (req, res) => {
  try {
    const { mobileNo } = req.user;
    const result = req.body;
    if (!result?.resultId) {
      return res.status(400).json({code: 400, status_code: "error", error: 'result id and other parameters is required' });
    }

    const user = await User.findOneAndUpdate(
      { mobileNo: mobileNo },
      { $push: { result: result } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ code: 404, status_code: "error", error: 'User not found' });
    }

    return res.status(200).json({ data: user, code: 200,  status_code: "success", message: "Score added successfully." })

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while updating the name' });
  }
}

exports.addUser = addUser;
exports.addUpdateUser = addUpdateUser;
exports.updateName = updateName;
exports.addScore = addScore;