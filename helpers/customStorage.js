const multer  = require('multer');
const { moveFiles, createDirectoryIfNotExists, removeFromArray, removeFile } = require('./util');
const { SOLUTION_FILES, FINAL_TEST_FILES, PRACTICE_TEST_FILES, EXERCISE_FILE} = require('../configuration/supports').DATA_FORM.FIELD_NAME;

const dest= {
    task: '/task/temp',
    submission: '/studentSubmissions'
};

const taskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dest.task);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + Date().now())
    }
});

const submissionStorage = multer.diskStorage({
    destination: dest.submission,
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const taskUpload = multer(taskStorage);
const submissionUpload = multer(submissionStorage);

const storeTaskFiles = async () => {
    return (req, res, next) => {

        console.log('-----MAPPING TASK FILES TO DIRECTORIES-----');

        let tempFiles = [].concat(
            req.files[SOLUTION_FILES].map(file => file.path),
            req.files[FINAL_TEST_FILES].map(file => file.path),
            req.files[PRACTICE_TEST_FILES].map(file => file.path),
            req.files[EXERCISE_FILE].map(file => file.path),
        );
        let movedFiles = [];

        try {
            const base_path = `/tasks/task${Date.now()}`;
            // create the directories to contain the task files
            createDirectoryIfNotExists(`${base_path}/${SOLUTION_FILES}`);
            createDirectoryIfNotExists(`${base_path}/${FINAL_TEST_FILES}`);
            createDirectoryIfNotExists(`${base_path}/${PRACTICE_TEST_FILES}`);
            createDirectoryIfNotExists(`${base_path}/${EXERCISE_FILE}`);

            // move files from temp directory to designated directories

            const solutionFiles = req.files[SOLUTION_FILES].map( file => {
                let newPath = `${base_path}/${SOLUTION_FILES}/${file.name}`;
                moveFiles(file.path, newPath);
                movedFiles.push(newPath);
                removeFromArray(tempFiles, file.path);
            });

            const practiceTest= req.files[FINAL_TEST_FILES].map( file => {
                let newPath = `${base_path}/${FINAL_TEST_FILES}/${file.name}`;
                moveFiles(file.path, newPath);
                movedFiles.push(newPath);
                removeFromArray(tempFiles, file.path);
            });

            const finalTest =  req.files[PRACTICE_TEST_FILES].map( file => {
                let newPath = `${base_path}/${PRACTICE_TEST_FILES}/${file.name}`;
                moveFiles(file.path, newPath);
                movedFiles.push(newPath);
                removeFromArray(tempFiles, file.path);
            });
            const exerciseZip = req.files[EXERCISE_FILE].map( file => {
                let newPath = `${base_path}/${EXERCISE_FILE}/${file.name}`;
                moveFiles(file.path, newPath);
                movedFiles.push(newPath);
                removeFromArray(tempFiles, file.path);
            });

            // add data to req object
            if (!req.value) {
                req.value = {};
            }
            if (!req.value['files']) {
                req.value['files'] = {};
            }
            req.value['files']['sulotion'] = { dir: `${base_path}/${SOLUTION_FILES}`, files: solutionFiles };
            req.value['files']['finalTest'] = { dir: `${base_path}/${FINAL_TEST_FILES}`, files: finalTest };
            req.value['files']['practiceTest'] = { dir: `${base_path}/${PRACTICE_TEST_FILES}`, files: practiceTest };
            req.value['files']['exerciseZip'] = { dir: `${base_path}/${EXERCISE_FILE}`, files: exerciseZip };
            next();
        } catch (e) {
            console.log('@@@ error occurred. removing all files.');
            // in case of an err delete all files and return err message to client
            tempFiles.map( path => removeFile(path));
            movedFiles.map( path => removeFile(path));

            res.status(400).json({
                success: false,
                message: 'failed to map task files',
                err: error
            });
        } finally {
            console.log('-----DONE-----');
        }
    }
};

module.exports = {
    taskUploader: {
        upload: taskUpload,
        storeFiles: storeTaskFiles
    },
    submissionUploader: {
        upload: submissionUpload
    }
};
