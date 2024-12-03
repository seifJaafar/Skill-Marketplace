const Job = require('../models/job');

const getJobsByclient = async (req, res) => {
    try {
        const jobs = await Job.find({ clientId: req.user.sub }).populate('skillPostId').populate('providerId');
        if (!jobs) {
            return res.status(200).json({ jobs: [] });
        }
        return res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        next(error);
    }
}
const getJobsByProvider = async (req, res) => {
    try {
        const jobs = await Job.find({ providerId: req.user.sub }).populate('client').populate('skillPostId').populate('providerId');
        if (!jobs) {
            return res.status(200).json({ jobs: [] });
        }
        return res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        next(error);
    }
}
module.exports = {
    getJobsByclient,
    getJobsByProvider
};