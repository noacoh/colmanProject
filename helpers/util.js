const { copyFile, mkdir, unlink } = require('fs').promises;
const {logger} = require('../configuration/winston');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
    createDirectoryIfNotExists: async (dir) => {
        try {
            await mkdir(dir, { recursive: true });
            logger.info(`new directory ${dir} created successfully`);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                logger.info(`directory ${dir} exists`);
            }
        }
    },
    // init directories

    moveFiles: async (old_path, new_path) => {
        try {
            await copyFile(old_path, new_path);
            logger.info(`moved file from ${old_path} to ${new_path} successfully`);
        } catch (err) {
            logger.error(`failed moving file from ${old_path} to ${new_path}`);
            throw err;
        }
        removeFile(old_path);

    },
    removeFile: async (path) => {
        try {
            await unlink(path);
            logger.info(`removed ${path}`);
        } catch (e) {
            logger.error(`failed to remove ${path}`);
            throw e;
        }
    },
    removeFromArray: (array, value) =>
    {
        let index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        }
    },
    copyFile: async (file, destination, newName) => {
        newName = newName ? newName: file.name;
        const newPath = `${destination}/${newName}`;
        try {
            await copyFile(file.path, newPath);
            logger.info(`moved file from ${file.path} to ${newPath} successfully`);
        } catch (err) {
            logger.error(`failed moving file from ${file.path} to ${newPath}`);
            throw err;
        }
    },
    deleteDir: async (dir) => {
        await exec(`rm -r ${dir}`);
    }
};
