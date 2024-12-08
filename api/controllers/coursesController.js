const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const apiJson = require('../utils/apiJson');
const Course = require('../models/course');
const Chapter = require('../models/chapter');
const File = require('../models/file');
const path = require('path');




exports.AddCourse = async (req, res, next) => {
    try {
        console.log(req.body);
        console.log(req.fileDetails, 'files');

        let { title, description, skillTags, price, skillExpert, chapterTitle } = req.body;
        skillTags = skillTags.split(',').map(tag => tag.trim());
        console.log(skillTags);

        if (!req.fileDetails || req.fileDetails.length === 0) {
            return next(new ExpressError('Please upload files', 400));
        }
        if (!req.thumbnailDetails) {
            return next(new ExpressError('Please upload thumbnail', 400));
        }
        const basePath = "uploads";

        const normalizePath = (fullPath) => {
            const relativePath = fullPath.split(`${basePath}\\`)[1];
            return `\\${basePath}\\${relativePath}`;
        };


        const files = req.fileDetails.map(file => {
            const ext = file.extension.toLowerCase();
            let fileType = 'PDF';

            if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) {
                fileType = 'Video';
            }

            const filenameWithoutExtension = path.basename(file.filename, ext);
            const modifiedUrl = normalizePath(file.url);

            return {
                title: filenameWithoutExtension,
                url: modifiedUrl,
                type: fileType,
                order: file.order
            };
        });


        const fileDocuments = await File.insertMany(files);




        const chapter = new Chapter({
            title: chapterTitle,
            files: fileDocuments.map(file => file._id),
        });

        await chapter.save();


        const course = new Course({
            title,
            description,
            skillTags,
            price,
            skillExpert: new mongoose.Types.ObjectId(skillExpert),
            chapters: [chapter._id],
            thumbnail: normalizePath(req.thumbnailDetails.url),
        });

        await course.save();


        res.status(200).json({ message: 'Course added successfully', course });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.GetCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('skillExpert', 'username email').sort({ usersEnrolled: -1 });
        res.status(200).json({ courses });
    } catch (error) {
        console.error(error);
        next(error);
    }
}
exports.GetChapters = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId).populate('chapters');
        if (!course) {
            return next(new ExpressError('Course not found', 404));
        }
        res.status(200).json({ chapters: course.chapters });
    } catch (error) {
        console.error(error);
        next(error);
    }
}
exports.AddChapter = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        let { chapterTitle, previousChapter } = req.body;
        if (!previousChapter) {
            return next(new ExpressError('Please provide a previous chapter', 400));
        }
        previousChapter = new mongoose.Types.ObjectId(previousChapter);
        console.log(previousChapter, 'previousChapter');
        if (!req.fileDetails || req.fileDetails.length === 0) {
            return next(new ExpressError('Please upload files', 400));
        }
        const basePath = "uploads";

        const normalizePath = (fullPath) => {
            const relativePath = fullPath.split(`${basePath}\\`)[1];
            return `\\${basePath}\\${relativePath}`;
        };
        const CourseDoc = await Course.findById(courseId);
        if (!CourseDoc) {
            return next(new ExpressError('Course not found', 404));
        }
        const files = req.fileDetails.map(file => {
            const ext = file.extension.toLowerCase();
            let fileType = 'PDF';

            if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) {
                fileType = 'Video';
            }

            const filenameWithoutExtension = path.basename(file.filename, ext);
            const modifiedUrl = normalizePath(file.url);

            return {
                title: filenameWithoutExtension,
                url: modifiedUrl,
                type: fileType,
                order: file.order
            };
        });
        const fileDocuments = await File.insertMany(files);
        const chapter = new Chapter({ title: chapterTitle, files: fileDocuments.map(file => file._id), previousChapter: previousChapter });
        await chapter.save();
        const nextChapter = await Chapter.find({ previousChapter: previousChapter });
        console.log(nextChapter);
        if (nextChapter.length > 1) {
            nextChapter[0].previousChapter = chapter._id;
            await nextChapter[0].save();
        }
        CourseDoc.chapters.push(chapter._id);
        await CourseDoc.save();
        res.status(200).json({ message: 'Chapter added successfully', chapter });

    } catch (error) {
        console.error(error);
        next(error);
    }
}
exports.DeleteCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.sub;
        const existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (userId !== existingCourse.skillExpert.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this course" });
        }

        await Course.findByIdAndDelete(courseId);


        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        next(error);
    }
}
exports.UpdateChapter = async (req, res, next) => {
    try {
        const chapterId = req.params.id;
        let updateData = req.body;
        console.log('updating chapter', updateData);
        const existingChapter = await Chapter.findById(chapterId);
        if (!existingChapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        const userId = req.user.sub;
        const { courseId } = req.body;
        const CourseDoc = await Course.findById(courseId);
        if (!CourseDoc) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (userId !== CourseDoc.skillExpert.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this chapter" });
        }
        delete updateData.courseId
        delete updateData.title
        updateData.title = updateData.chapterTitle
        delete updateData.chapterTitle
        if (req.fileDetails && req.fileDetails.length !== 0) {
            const basePath = "uploads";

            const normalizePath = (fullPath) => {
                const relativePath = fullPath.split(`${basePath}\\`)[1];
                return `\\${basePath}\\${relativePath}`;
            };


            const files = req.fileDetails.map(file => {
                const ext = file.extension.toLowerCase();
                let fileType = 'PDF';

                if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) {
                    fileType = 'Video';
                }

                const filenameWithoutExtension = path.basename(file.filename, ext);
                const modifiedUrl = normalizePath(file.url);

                return {
                    title: filenameWithoutExtension,
                    url: modifiedUrl,
                    type: fileType,
                    order: file.order
                };
            });


            const fileDocuments = await File.insertMany(files);
            updateData.files = fileDocuments.map(file => file._id);
        }



        const updatedChapter = await Chapter.findByIdAndUpdate(
            chapterId,
            { $set: updateData },
            { new: true, runValidators: true }
        );


        return res.status(200).json({
            message: "Chapter updated successfully",
            data: updatedChapter,
        });
    } catch (error) {
        console.error("Error updating chapter:", error);
        next(error);
    }
}
exports.DeleteChapter = async (req, res, next) => {
    try {
        const chapterId = req.params.id;
        const userId = req.user.sub;
        const { courseId } = req.query;
        const existingChapter = await Chapter.findById(chapterId);
        if (!existingChapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        if (!courseId) {
            return res.status(404).json({ message: "Course not found" });
        }
        const CourseDoc = await Course.findById(courseId);
        if (userId !== CourseDoc.skillExpert.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this chapter" });
        }


        await Chapter.findByIdAndDelete(chapterId);
        CourseDoc.chapters = CourseDoc.chapters.filter(chapter => chapter.toString() !== chapterId);
        await CourseDoc.save();
        return res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
        console.error("Error deleting chapter:", error);
        next(error);
    }
}
exports.UpdateFile = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const updateData = req.body;

        const userId = req.user.sub;
        const { courseId } = req.body;
        const existingFile = await File.findById(fileId);
        if (!existingFile) {
            return res.status(404).json({ message: "File not found" });
        }
        const CourseDoc = await Course.findById(courseId);
        if (!CourseDoc) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (userId !== CourseDoc.skillExpert.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this file" });
        }
        delete updateData.courseId
        const updatedFile = await File.findByIdAndUpdate(
            fileId,
            { $set: updateData },
            { new: true, runValidators: true }
        );


        return res.status(200).json({
            message: "File updated successfully",
            data: updatedFile,
        });
    } catch (error) {
        console.error("Error updating file:", error);
        next(error);
    }
}
exports.DeleteFile = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const userId = req.user.sub;
        const { chapterId, courseId } = req.query;
        console.log(chapterId, courseId);
        const existingFile = await File.findById(fileId);
        if (!existingFile) {
            return res.status(404).json({ message: "File not found" });
        }
        const CourseDoc = await Course.findById(courseId);
        if (!CourseDoc) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (userId !== CourseDoc.skillExpert.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this file" });
        }
        if (!chapterId) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        await File.findByIdAndDelete(fileId);
        const chapter = await Chapter.findById(chapterId);
        chapter.files = chapter.files.filter(file => file.toString() !== fileId);
        await chapter.save();
        return res.status(200).json({ message: "File deleted successfully" });

    } catch (error) {
        console.error("Error deleting file:", error);
        next(error);
    }
}
exports.GetCourseByid = async (req, res, next) => {
    try {
        let { id } = req.params;
        if (!id) {
            return next(new ExpressError('Please provide a course id', 400));
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ExpressError('Invalid course id', 400));
        }
        id = new mongoose.Types.ObjectId(id);
        const course = await Course.findById(id).populate('skillExpert', 'username email').populate({
            path: 'chapters',
            populate: {
                path: 'files',
            },
        });
        if (!course) {
            return next(new ExpressError('Course not found', 404));
        }
        res.status(200).json({ course });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.UpdateCourse = async (req, res, next) => {
    try {
        console.log(req.body);
        const courseId = req.params.id;
        let updateData = req.body;
        console.log(updateData, 'updating course');
        const userId = req.user.sub;
        const existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (userId !== existingCourse.skillExpert.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this course" });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateData },
            { new: true, runValidators: true }
        );


        return res.status(200).json({
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Error updating course:", error);
        next(error);
    }
};