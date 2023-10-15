const Test = require("../model/Test");
const User = require("../model/User")

const updateUserStream = async (req, res) => {
    try {
      // Update users with 'NEET' to 'DROPPER-PCB'
      const neetUpdateResult = await User.updateMany({ stream: 'NEET' }, { $set: { stream: 'DROPPER-PCB' }});
  
      // Update users with 'JEE' to 'DROPPER-PCM'
      const jeeUpdateResult = await User.updateMany({ stream: 'JEE' }, { $set: { stream: 'DROPPER-PCM' }});

      res.status(200).json({
        code: 200,
        status_code: 'success',
        message: 'Updated records successfully.',
        data: {
            neetUpdateResult,
            jeeUpdateResult,
        }
      });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({
        code: 500,
        status_code: "error",
        error: 'An error occurred while updating the stream',
      });
    }
}

const updateTestSubjectNames = async (req, res) => {
    // "PHYSICS" | "CHEMISTRY" | "BIOLOGY" | "MATHS"
    try {
      // Update users to 'PHYSICS'
      const physicsSub = await Test.updateMany({ subjectName: 'Physics' }, { $set: { subjectName: 'PHYSICS' }});
      // Update users to 'CHEMISTRY'
      const chemistrySub = await Test.updateMany({ subjectName: 'Chemistry' }, { $set: { subjectName: 'CHEMISTRY' }});
      // Update users to BIOLOGY
      const bioSub = await Test.updateMany({ subjectName: 'Biology' }, { $set: { subjectName: 'BIOLOGY' }});
      // Update users to 'MATHS'
      const mathSub = await Test.updateMany({ subjectName: 'Maths' }, { $set: { subjectName: 'MATHS' }});

      res.status(200).json({
        code: 200,
        status_code: 'success',
        message: 'Updated records successfully.',
        data: {
            physicsSub,
            chemistrySub,
            bioSub,
            mathSub
        }
      });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({
        code: 500,
        status_code: "error",
        error: 'An error occurred while updating the stream',
      });
    }
}

const updateTestStreamToArray = async (req, res) => {
    // "PHYSICS" -> stream= ["DROPPER-PCB", "DROPPER-PCM"] 
    // "CHEMISTRY" stream= ["DROPPER-PCB", "DROPPER-PCM"]
    // "BIOLOGY" stream= ["DROPPER-PCB"]
    // "MATHS" stream= ["DROPPER-PCM"]
    try {
      // Update users to 'PHYSICS'
      const physicsSub = await Test.updateMany({ subjectName: 'PHYSICS' }, { $set: { stream: ["DROPPER-PCB", "DROPPER-PCM"] }});
      // Update users to 'CHEMISTRY'
      const chemistrySub = await Test.updateMany({ subjectName: 'CHEMISTRY' }, { $set: { stream: ["DROPPER-PCB", "DROPPER-PCM"] }});
      // Update users to BIOLOGY
      const bioSub = await Test.updateMany({ subjectName: 'BIOLOGY' }, { $set: { stream: ["DROPPER-PCB"] }});
      // Update users to 'MATHS'
      const mathSub = await Test.updateMany({ subjectName: 'MATHS' }, { $set: { stream: ["DROPPER-PCM"] }});
  
      res.status(200).json({
        code: 200,
        status_code: 'success',
        message: 'Updated stream to array successfully.',
        data: {
            physicsSub,
            chemistrySub,
            bioSub,
            mathSub
        }
      });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({
        code: 500,
        status_code: "error",
        error: 'An error occurred while updating the stream',
      });
    }
}


exports.updateUserStream = updateUserStream;
exports.updateTestSubjectNames = updateTestSubjectNames;
exports.updateTestStreamToArray = updateTestStreamToArray;