const Result = require("../model/Result");
const Test = require("../model/Test")

const addTest = async (req, res) => {
    try {
        const data = req.body;
        if (!data.id || !data.title) {
          return res.status(400).json({ code: 400,  status_code: "error", error: 'Test details are required.' });
        }
        
        try {
            const newTest = new Test({
                ...data
            })
            await newTest.save();
    
            return res.status(201).json({data: newTest, code: 200,  status_code: "success", message: "Test added successfully."})
        } catch (error) {
            res.status(500).json({ code: 500,  status_code: "error", error: 'Enter in adding test' });
        }
      } catch (error) {
        res.status(500).json({ code: 500,  status_code: "error", error: 'An error occurred while adding the test' });
      }
}

const getTest = async (req, res) => {
    try {
        const { testId } =  req.params;
        if (!testId) {
          return res.status(400).json({ code: 400,  status_code: "error", error: 'Test id required' });
        }
    
        const test = await Test.find({ id: testId });

        if (!test || test.length <= 0) {
          return res.status(404).json({ code: 404,  status_code: "error", error: 'Test not found' });
        }

        return res.status(200).json({data: test[0], code: 200,  status_code: "success", message: "Test fetched successfully."})

      } catch (error) {
        res.status(500).json({ code: 500,  status_code: "error", error: 'An error occurred while fetching the test details' });
      }
}

const submitResult = async (req, res) => {
  try {
      const data = req.body;
      if (!data.testId || !data.questions || !data.questions.length < 0) {
        return res.status(400).json({ code: 400,  status_code: "error", error: 'Test details are required.' });
      }       
      const reqQuestions = data.questions;
      try {
          const test = await Test.findOne(
              {id: data.testId}
          );

          let scoreCount = 0;
          if(test){
            test.questions.forEach(element => {
              const index = reqQuestions.some(x=> x.id === element.id && x?.answer === element?.correctAnswer);
              if(index){
                scoreCount++;
              }
            });

            try {
              const resResult = {
                userId: req.user.userId,
                testId: test._id,
                score: scoreCount,
                rank: null
              }
              const newResult = new Result(resResult)
              await newResult.save();
          
              return res.status(200).json({ data: { ...resResult }, code: 200,  status_code: "success", message: "Score added successfully." })
            } catch (error) {
              res.status(500).json({ code: 500,  status_code: "error", error: 'Enter correct mobile number' });
            }
            
          }
          else{
            res.status(500).json({ code: 500,  status_code: "error", error: 'Test not found.' });
          }
  
      } catch (error) {
          res.status(500).json({ code: 500,  status_code: "error", error: 'Test not found' });
      }
    } catch (error) {
      res.status(500).json({ code: 500,  status_code: "error", error: 'An error occurred while adding the test' });
    }
}

exports.addTest = addTest;
exports.getTest = getTest;
exports.submitResult = submitResult;