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
     for (const score of sortedScores) {
       score.rank = rank++;
       // Save the updated rank to the database
       await score.save();
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


exports.getResultDashboard = getResultDashboard;
exports.generateRank = generateRank;
exports.getResultByTest = getResultByTest;