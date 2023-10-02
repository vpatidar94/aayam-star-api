const Result = require("../model/Result");
const Test = require("../model/Test");
const User = require("../model/User");

const getResultDashboard = async (req, res) => {
  try {
    // Get the score of last test given
    const lastTest = await Result.find({userId : req.user.userId})
    .populate('testId')
    .sort({ 'dateCreated': -1 })
    
    try {
        const currentDate = new Date();
        const startDate = new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          0+5,
          30,
          0
        ); // Start of the day
        const endDate = new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          23+5,
          59+30,
          59
        ); // End of the day

        const todaysTest = await Test.find({testDate : {
          $gte: startDate,
          $lte: endDate
        }});
        // if results are available then check it is attempted by user or not
        if(todaysTest && todaysTest.length > 0 && todaysTest[0]?._id){
          try {
            const isAvailable = await Result.find({testId : todaysTest[0]._id, userId: req.user.userId});  
            return res.status(200).json(
              { 
                data: {
                  allTestSort: lastTest,
                  lastTestResult: lastTest.length > 0 ? lastTest[0] : null,
                  todaysTest: todaysTest[0],
                  todaysTestIsAttempted: isAvailable?.length > 0 ? true : false,
                }, 
                code: 200,  
                status_code: "success", 
                message: "Score added successfully."
              }
            )
          } catch (error) {
            res.status(500).json({ code: 500,  status_code: "error", error: 'An error occurred while fetching the todays test details' });
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
    res.status(500).json({ code: 500,  status_code: "error", error: 'Enter correct mobile number' });
  }
}

const generateRank = async (req, res) => {  
  const { testId } =  req.params; 
  try {
    // Get the score of last test given
    const sortedScores = await Result.find({testId : testId})
    .sort({ score: -1, duration: 1 })
    .exec();

     // Update the rank field based on the sorted order
     let rank = 1;
     let lastStuRes = null;
     for (const std of sortedScores) {
      if(lastStuRes != null){
        if(!(lastStuRes?.score === std.score && lastStuRes?.duration === std.duration)){
          rank++;
        }
      }
       lastStuRes = std;
       std.rank = std.score === 0 ? 0 : rank;
      //  const points = ((1-((std.rank+1)/sortedScores.length))*100).toFixed(2); // old formulae
       const points = (((sortedScores.length-rank+1)/sortedScores.length)*100).toFixed(2); // new formulae
       std.points = std.score === 0 ? 0 : points;
       // Save the updated rank to the database
       await std.save();
     }
 
     res.status(200).json({
       data: sortedScores,
       code: 200,
       status_code: 'success',
       message: 'Rank generated successfully.',
     });
    
  } catch (error) {
    res.status(500).json({ code: 500,  status_code: "error", error: 'Wrong test id.' });
  }
}

const getResultByTest = async (req, res) => {  
  const { testId } =  req.params; 
  try {
    // Get the score of last test given
    const result = await Result.find({testId : testId})
    .sort({ rank: 1 })
    .populate('userId')

     res.status(200).json({
       data: result,
       code: 200,
       status_code: 'success',
       message: 'Result details fetched successfully.',
     });
    
  } catch (error) {
    res.status(500).json({ code: 500,  status_code: "error", error: 'Wrong test id.' });
  }
}

const getAllScorePoints = async (req, res) => {  
  const { testId } =  req.params; 
  try {
    // Get the score of last test given
    const user = await User.find({_id : req.user.userId})

    const results = await Result.find({userId : req.user.userId})

     res.status(200).json({
       data: {
        tests: results,
        userReferralPoints: user && user?.length>0 && user[0]?.referralPoints ? user[0]?.referralPoints : 0
       },
       code: 200,
       status_code: 'success',
       message: 'Score points details fetched successfully.',
     });
    
  } catch (error) {
    res.status(500).json({ code: 500,  status_code: "error", error: 'Error fetching the records.' });
  }
}


exports.getResultDashboard = getResultDashboard;
exports.generateRank = generateRank;
exports.getResultByTest = getResultByTest;
exports.getAllScorePoints = getAllScorePoints;