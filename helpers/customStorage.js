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

        // keep track of the files saved to disk, so they can be deleted in case of unexpected error
        let tempFiles = [];
        let movedFiles = [];

        tempFiles = req.files[SOLUTION_FILES]? tempFiles.concat(req.files[SOLUTION_FILES].map(file => file.path)): tempFiles;
        tempFiles = req.files[FINAL_TEST_FILES]? tempFiles.concat(req.files[FINAL_TEST_FILES].map(file => file.path)): tempFiles;
        tempFiles = req.files[PRACTICE_TEST_FILES]? tempFiles.concat(req.files[PRACTICE_TEST_FILES].map(file => file.path)): tempFiles;
        tempFiles = req.files[EXERCISE_FILE]? tempFiles.concat(req.files[EXERCISE_FILE].map(file => file.path)): tempFiles;

        const extractFiles = (baseDir, fieldName) =>{
            // creates a new directory if it not exists
            createDirectoryIfNotExists(baseDir);
            let files = req.files[fieldName].map( file => {
                let newPath = `${baseDir}/${file.name}`;
                moveFiles(file.path, newPath);
                movedFiles.push(newPath);
                removeFromArray(tempFiles, file.path);
            });
            return {
                dir: baseDir,
                files: files
            };
        };

        try {
            const base_path = `/tasks/task${Date.now()}`;
            // add data to req object
            if (!req.value) {
                req.value = {};
            }
            if (!req.value['files']) {
                req.value['files'] = {};
            }
            if (req.files[SOLUTION_FILES]){
                req.value['files']['solution'] = extractFiles(`${base_path}/${SOLUTION_FILES}`, SOLUTION_FILES);
            }
            if(req.files[FINAL_TEST_FILES]){
                req.value['files']['finalTest'] = extractFiles(`${base_path}/${FINAL_TEST_FILES}`, FINAL_TEST_FILES);
            }
            if(req.files[PRACTICE_TEST_FILES]){
                req.value['files']['practiceTest'] = extractFiles(`${base_path}/${PRACTICE_TEST_FILES}`, PRACTICE_TEST_FILES);

            }
            if (req.files[EXERCISE_FILE]){
                req.value['files']['exerciseZip'] =  extractFiles(`${base_path}/${EXERCISE_FILE}`, EXERCISE_FILE);
            }

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
