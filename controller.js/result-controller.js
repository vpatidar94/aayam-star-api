const Result = require("../model/Result");
const Test = require("../model/Test");
const User = require("../model/User");
const { sendRank } = require('../services/whatsapp-service');
const resultService = require('../services/resultService'); // Adjust the path based on your project structure

const getResultDashboard = async (req, res) => {
  try {
    // Get the score of last test given
    const lastTest = await Result.find({ userId: req.user.userId })
      .populate('testId')
      .sort({ 'dateCreated': -1 })

    const user = await User.findOne({ _id: req.user.userId });
    try {
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());

      const startDate = new Date(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        0,
        0,
        0
      ); // Start of the day
      const endDate = new Date(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        23,
        59,
        59
      ); // End of the day      

      startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
      endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());

      const todaysTest = await Test.find({
        testDate: {
          $gte: startDate,
          $lte: endDate
        }
      });
      // if results are available then check it is attempted by user or not
      if (todaysTest && todaysTest.length > 0 && todaysTest[0]?._id) {
        const userStream = user && user?.stream ? user.stream : null;

        let currentTestIndex = todaysTest.findIndex(x => x.stream.includes(userStream));
        const currentTest = currentTestIndex != -1 ? todaysTest[currentTestIndex] : null;

        try {
          let isAvailable = null;
          if (currentTest)
            isAvailable = await Result.find({ testId: currentTest._id, userId: req.user.userId });
          return res.status(200).json(
            {
              data: {
                allTestSort: lastTest,
                lastTestResult: lastTest.length > 0 ? lastTest[0] : null,
                todaysTest: currentTest,
                todaysTestIsAttempted: isAvailable?.length > 0 ? true : false,
              },
              code: 200,
              status_code: "success",
              message: "Score added successfully."
            }
          )
        } catch (error) {
          res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while fetching the todays test details' });
        }
      }
      else {
        return res.status(200).json(
          {
            data: {
              allTestSort: lastTest,
              lastTestResult: lastTest.length > 0 ? lastTest[0] : null,
              todaysTest: null,
              todaysTestIsAttempted: null,
            },
            code: 201,
            status_code: "success",
            message: "No test found for today."
          }
        )
      }

    } catch (error) {
      res.status(500).json({ code: 500, d: lastTest, status_code: "error", error: 'An error occurred while fetching the test details' });
    }
  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'Enter correct mobile number' });
  }
}

const generateRank = async (req, res) => {
  const { testId } = req.params;
  try {
    // Get the score of last test given
    const sortedScores = await Result.find({ testId: testId })
      .sort({ score: -1, duration: 1 })
      .exec();

    // Update the rank field based on the sorted order
    let rank = 1;
    let lastStuRes = null;
    for (const std of sortedScores) {
      if (lastStuRes != null) {
        if (!(lastStuRes?.score === std.score && lastStuRes?.duration === std.duration)) {
          rank++;
        }
      }
      lastStuRes = std;
      // std.rank = std.score === 0 ? 0 : rank;
      // Adjust the rank calculation with the multiplier of 11/4
      const rankMultiplier = 2.47;
      std.rank = std.score === 0 ? 0 : Math.ceil(rank * rankMultiplier);
      //  const points = ((1-((std.rank+1)/sortedScores.length))*100).toFixed(2); // old formulae
      const points = (((Math.ceil(sortedScores.length * 11/4.2)- std.rank + 1) / Math.ceil(sortedScores.length * 11/4)) * 100).toFixed(2); // new formulae
      std.points = std.score === 0 ? 0 : points;
      // Save the updated rank to the database
      await std.save();

      const testTable = await Test.findOne({ _id: testId });
      if (testTable) {
        console.log('tt', testTable.isRankGenerated);
        testTable.isRankGenerated = true;
        console.log('newtt', testTable.isRankGenerated);
        await testTable.save();
      }
    }

    res.status(200).json({
      data: sortedScores,
      code: 200,
      status_code: 'success',
      message: 'Rank generated successfully.',
    });

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'Wrong test id.' });
  }
}

// const generateRank = async (req, res) => {
//   const { testId } = req.params;
//   try {
//     // Get the score of last test given
//     const sortedScores = await Result.find({ testId: testId })
//       .sort({ score: -1, duration: 1 })
//       .exec();

//     // Update the rank field based on the sorted order
//     let rank = 1;
//     let lastStuRes = null;
//     for (const std of sortedScores) {
//       if (lastStuRes != null) {
//         if (!(lastStuRes?.score === std.score && lastStuRes?.duration === std.duration)) {
//           rank++;
//         }
//       }
//       lastStuRes = std;
//       std.rank = std.score === 0 ? 0 : rank;
//       //  const points = ((1-((std.rank+1)/sortedScores.length))*100).toFixed(2); // old formulae
//       const points = (((sortedScores.length - rank + 1) / sortedScores.length) * 100).toFixed(2); // new formulae
//       std.points = std.score === 0 ? 0 : points;
//       // Save the updated rank to the database
//       await std.save();

//       const testTable = await Test.findOne({ _id: testId });
//       if (testTable) {
//         console.log('tt', testTable.isRankGenerated);
//         testTable.isRankGenerated = true;
//         console.log('newtt', testTable.isRankGenerated);
//         await testTable.save();
//       }
//     }

//     res.status(200).json({
//       data: sortedScores,
//       code: 200,
//       status_code: 'success',
//       message: 'Rank generated successfully.',
//     });

//   } catch (error) {
//     res.status(500).json({ code: 500, status_code: "error", error: 'Wrong test id.' });
//   }
// }

const sendWpMessage = async (req, res) => {
  const data = req.body;
  const { testId, title } = data;

  try {
    // Get the score of last test given
    const results = await Result.find({ testId: testId });
    const totalStudents = results.length * 10;
    for (const std of results) {
      try {
        const user = await User.find({ _id: std.userId });
        const userId = std.userId;
        const totalPoints = await resultService.calculateTotalPoints(userId);
        if (user.length > 0 && !!user[0]?.mobileNo)
          await sendRank(user[0], std, totalStudents, title, totalPoints);
      } catch (error) {
        console.error('Error sending WhatsApp message:', error);
      }
    }

    res.status(200).json({
      data: results,
      code: 200,
      status_code: 'success',
      message: 'Whatsapp messages send successfully.',
    });

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'Wrong test id.' });
  }
}

const getResultByTest = async (req, res) => {
  const { testId } = req.params;
  try {
    // Get the score of last test given
    const result = await Result.find({ testId: testId })
      .sort({ rank: 1 })
      .populate('userId')

    res.status(200).json({
      data: result,
      code: 200,
      status_code: 'success',
      message: 'Result details fetched successfully.',
    });

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'Wrong test id.' });
  }
}

const getTestResultByUser = async (req, res) => {
  const userId = req.user.userId;
  const { testId } = req.params;
  // const {userId} = req.user.userId
  try {
    // Get the score of last test given
    const result = await Result.find({ testId: testId, userId: userId })

    res.status(200).json({
      data: result,
      code: 200,
      status_code: 'success',
      message: 'Result details fetched successfully.',
    });

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'Wrong test id.' });
  }
}
//  <!----new api-------------------->
// const getAllResultsDetails = async (req, res, next) => {
//   try {
//     const results = await User.aggregate([
//       {
//         $lookup: {
//           from: "results",
//           localField: "_id",
//           foreignField: "userId",
//           as: "userResults"
//         }
//       },
//       {
//         $project: {
//           userId: "$_id",
//           name: 1,
//           mobileNo: 1,
//           stream: 1,
//           referralPoints: 1,
//           totalTestPoints: { $sum: "$userResults.points" },
//           totalTests: {
//             $sum: {
//               $cond: [
//                 { $isArray: "$userResults" },
//                 { $size: "$userResults" },
//                 0
//               ]
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: 1,
//           name: 1,
//           mobileNo: 1,
//           stream: 1,
//           referralPoints: 1,
//           totalTestPoints: 1,
//           totalTests: 1,
//           totalPoints: { $sum: ["$totalTestPoints", "$referralPoints"] }
//         }
//       },
//       {
//         $sort: { totalPoints: -1, totalTests: -1 }
//       }
//     ]);


//     if (!results) {
//       return res.status(500).json({ code: "error", message: "Internal Server Error" });
//     }

//     return res.status(200).json({ data: results, code: "success", message: "Data fetched successfully." });
//   } catch (err) {
//     return next(err);
//   }
// }

const getAllResultsDetails = async (req, res, next) => {
  try {
    const orgCode = req.user.orgCode; // Assuming the orgCode is available in the token
    console.log(req.user)
    const pipeline = [
      {
        $lookup: {
          from: "results",
          localField: "_id",
          foreignField: "userId",
          as: "userResults"
        }
      },
      {
        $project: {
          userId: "$_id",
          name: 1,
          mobileNo: 1,
          stream: 1,
          referralPoints: 1,
          totalTestPoints: { $sum: "$userResults.points" },
          totalTests: {
            $sum: {
              $cond: [
                { $isArray: "$userResults" },
                { $size: "$userResults" },
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          name: 1,
          mobileNo: 1,
          stream: 1,
          referralPoints: 1,
          totalTestPoints: 1,
          totalTests: 1,
          totalPoints: { $sum: ["$totalTestPoints", "$referralPoints"] }
        }
      },
      {
        $sort: { totalPoints: -1, totalTests: -1 }
      }
    ];

    // Conditionally add $match stage if orgCode is present in the token
    if (orgCode) {
      pipeline.unshift({
        $match: {
          orgCode: orgCode
        }
      });
    }

    const results = await User.aggregate(pipeline);

    if (!results) {
      return res.status(500).json({ code: "error", message: "Internal Server Error" });
    }

    return res.status(200).json({ data: results, code: "success", message: "Data fetched successfully." });
  } catch (err) {
    return next(err);
  }
};


const getAllScorePoints = async (req, res) => {
  const { testId } = req.params;
  try {
    // Get the score of last test given
    const user = await User.find({ _id: req.user.userId })

    const results = await Result.find({ userId: req.user.userId })

    res.status(200).json({
      data: {
        tests: results,
        userReferralPoints: user && user?.length > 0 && user[0]?.referralPoints ? user[0]?.referralPoints : 0
      },
      code: 200,
      status_code: 'success',
      message: 'Score points details fetched successfully.',
    });

  } catch (error) {
    res.status(500).json({ code: 500, status_code: "error", error: 'Error fetching the records.' });
  }
}


exports.getResultDashboard = getResultDashboard;
exports.generateRank = generateRank;
exports.getResultByTest = getResultByTest;
exports.getAllScorePoints = getAllScorePoints;
exports.sendWpMessage = sendWpMessage;
exports.getAllResultsDetails = getAllResultsDetails;
exports.getTestResultByUser = getTestResultByUser;