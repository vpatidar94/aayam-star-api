const User = require("../model/User");
const Result = require("../model/Result");
const Test = require("../model/Test");

const getResultDashboard = async (req, res) => {   
  try {
    // Get the score of last test given
    const lastTest = await Result.find({userId : req.user.userId})
    .populate('testId')
    .sort({ 'submitDate': 1 })
    
    try {
        const currentDate = new Date();
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

        const todaysTest = await Test.find({testDate : {
          $gte: startDate,
          $lte: endDate
        }})
        // if results are available then check it is attempted by user or not
        if(todaysTest.length > 0){
          try {
            const isAvailable = await Result.find({testId : todaysTest[0]._id});        
            return res.status(200).json(
              { 
                data: {
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
                lastTestResult: lastTest.length > 0 ? lastTest[0] : null,
                todaysTest: null,
                todaysTestIsAttempted: isAvailable,
              }, 
              code: 201,  
              status_code: "success", 
              message: "No test found for today."
            }
          )
        }

    } catch (error) {
      res.status(500).json({ code: 500,  status_code: "error", error: 'An error occurred while fetching the test details' });
    }
  } catch (error) {
    res.status(500).json({ code: 500,  status_code: "error", error: 'Enter correct mobile number' });
  }
}

exports.getResultDashboard = getResultDashboard;