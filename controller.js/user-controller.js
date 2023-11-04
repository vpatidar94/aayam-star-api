const User = require("../model/User")
const { generateToken, verifyToken } = require('../middleware/jwt-token');
const Organisation = require("../model/Organisation");
// const fetchIdByToken = require('../services/token');

const getAllUsers = async (req, res, next) => {
  let users = ''
  try {
    users = await User.find();
  } catch (err) {
    return next(err)
  }

  if (!users) {
    return res.status(500).json({ code: "error", message: "Internal Server Error" });
  }

  return res.status(200).json({ data: users, code: "success", message: "Data fetched successfully." })
}

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ code: 404, status_code: "error", message: "userId required" })
    }
    const user = await User.findById(userId);
    return res.status(200).json({ data: user, code: 200, status_code: "success", message: "User Fetched Successfully", })

  } catch {
    return res.status(500).json({ code: 500, status_code: "error", message: "an error occured while fetching user" })
  }
}

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
    const userType = user.type ?? 'user';
    const orgCode = user.orgCode ?? null;
    const token = generateToken(user._id, user.mobileNo, userType, orgCode);
    return res.status(200).json({ data: { token, user, isNew: false, userType: userType }, code: 200, status_code: "success", message: "User updated successfully." })

  } catch (error) {
    console.log('e2', error);
    res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while updating the mobile number' });
  }
}

const addNewUser = async (req, res) => {
  const { mobileNo, referredBy } = req.body;

  if ((!mobileNo)) {
    return res.status(400).json({ code: 400, status_code: "error", message: "Mobile number is required." })
  }

  try {
    const referringUser = null;
    if (referredBy) {
      const referringUser = await User.findById(referredBy);
      if (!referringUser) {
        return;
      }
      // Update the user's referredBy field with the referring user's ID
      referringUser.referralPoints = (referringUser?.referralPoints ?? 0) + 20;
      await referringUser.save();
    }

    const newUser = new User({
      mobileNo,
      isVerified: true,
      referredBy: referringUser ? referringUser._id : null
    });

    await newUser.save();
    const userType = newUser.type ?? 'user';
    const token = generateToken(newUser._id, newUser.mobileNo, userType);

    return res.status(201).json({ data: { token, user: newUser, isNew: true, userType: userType }, code: 200, status_code: "success", message: "User added successfully." })
  } catch (error) {
    console.log('e', error);
    res.status(500).json({ code: 500, status_code: "error", error: 'Enter correct mobile number' });
  }
}

const addUser = async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name && name.trim() === "") || (!email && email.trim() === "") || (!password && password.trim() === "")) {
    return res.status(422).json({ code: 422, status_code: "error", message: "Invalid data." })
  }

  try {
    const newUser = new User({
      name, email, password
    })
    await newUser.save();
    return res.status(201).json({ data: newUser, code: 200, status_code: "success", message: "User added successfully." })
  } catch (error) {
    console.log('e', error);
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
    const { name, stream, orgCode } = req.body;

    if (!name) {
      return res.status(400).json({ code: 400, status_code: "error", error: 'Name is required' });
    }

    const org = await Organisation.findOne({ orgCode: orgCode })
    if (!org && orgCode !== null && orgCode !== undefined) {
      return res.status(404).json({ code: 404, status_code: "error", error: "Organisation not found" })
    }

    const user = await User.findOneAndUpdate(
      { mobileNo: mobileNo },
      { name, stream, orgCode },
    );
    if (!user) {
      return res.status(404).json({ code: 404, status_code: "error", error: 'User not found' });
    }

    return res.status(200).json({ data: user, code: 200, status_code: "success", message: "Name updated successfully." })

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while updating the name', err: error });
  }
}

const addOrgAdminUser = async (req, res) => {
  try {
    const mobileNo = req.body.mobileNo;
    const orgCode = req.body.orgCode;
    if (!mobileNo) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const adminUser = await User.findOne({ mobileNo: mobileNo });

    if (!adminUser) {
      const orgExist = await Organisation.findOne({ orgCode: orgCode });
      if (!orgExist) {
        return res.status(400).json({ error: 'Organisation does not exist. Contact admin.' });
      }
      // If admin user doesn't exist, add a new admin user
      return addOrgNewAdminUser(req, res, orgExist?._id);
    }

    return res.status(403).json({ code: 403, status_code: "error", error: 'You already registered to application. Please login.' });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while updating the mobile number' });
  }
};

const addOrgNewAdminUser = async (req, res, orgId) => {
  const { mobileNo, orgCode } = req.body;
  try {
    const userType = 'org-admin';
    const newAdminUser = new User({
      mobileNo,
      isVerified: true,
      type: userType,
      orgCode: orgCode,
      organisationId: orgId
    });
    await newAdminUser.save();
    const token = generateToken(newAdminUser._id, newAdminUser.mobileNo, userType, orgCode);

    await sendWpAdminLoginLink(mobileNo); 
    return res.status(200).json(
      {
        data:
        {
          token, mobileNo: newAdminUser.mobileNo,
          isVerified: newAdminUser.isVerified,
          isNew: true,
          userType: userType,
          orgCode: orgCode,
          organisationId: orgId
        },
        code: 200,
        status_code: "success",
        message: "User added successfully."
      });

  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ code: 500, status_code: "error", error: 'Enter correct mobile number' });
  }
};

const updateOrgAdminDetails = async (req, res) => {
  try {
    const { mobileNo } = req.user;

    const { name, designation } = req.body;
    if (!name) {
      return res.status(400).json({ code: 400, status_code: "error", error: "Name is required" })
    }

    const adminUser = await User.findOneAndUpdate(
      { mobileNo: mobileNo },
      { name, designation }
    );

    if (!adminUser) {
      return res.status(404).json({ code: 404, status_code: "error", error: 'User not found' });
    }
    return res.status(200).json({ data: adminUser, code: 200, status_code: "success", message: "Details updated successfully" })
  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: "An error occurred while updating the details" })
  }
}

const addScore = async (req, res) => {
  try {
    const { mobileNo } = req.user;
    const result = req.body;
    if (!result?.resultId) {
      return res.status(400).json({ code: 400, status_code: "error", error: 'result id and other parameters is required' });
    }

    const user = await User.findOneAndUpdate(
      { mobileNo: mobileNo },
      { $push: { result: result } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ code: 404, status_code: "error", error: 'User not found' });
    }

    return res.status(200).json({ data: user, code: 200, status_code: "success", message: "Score added successfully." })

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while updating the name' });
  }
}

exports.addUser = addUser;
exports.addUpdateUser = addUpdateUser;
exports.updateName = updateName;
exports.addScore = addScore;
exports.getAllUsers = getAllUsers;
exports.addOrgAdminUser = addOrgAdminUser;
exports.updateOrgAdminDetails = updateOrgAdminDetails;
exports.getUserById = getUserById;