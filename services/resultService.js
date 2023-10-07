const mongoose = require('mongoose');
const Result = require('../model/Result'); // Adjust the path based on your project structure

async function calculateTotalPoints(userId) {
    try {
        const result = await Result.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $lookup: {
                    from: 'users', // Assuming your user collection is named 'users'
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $group: {
                    _id: null,
                    referralPoints: { $first: '$user.referralPoints' },
                    totalPoints: { $sum: '$points' } // Sum all the points in the array
                }
            },
            {
                $project: {
                    _id: 0,
                    totalPoints: {
                        $sum: [
                            '$referralPoints',
                            '$totalPoints'
                        ]
                    }
                }
            }
        ]);

        console.log('Total Points:', result.length > 0 ? result[0].totalPoints : 0);
        return result.length > 0 ? result[0].totalPoints : 0;
    } catch (error) {
        console.error('Error during aggregation:', error);
        return {
            error: 'An error occurred during the calculation.',
            details: error.message // Optionally include details of the error
        };
    }
}

module.exports = {
    calculateTotalPoints
};
