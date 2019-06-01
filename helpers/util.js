const { copyFile, mkdir, unlink } = require('fs').promises;

module.exports = {
    createDirectoryIfNotExists: async (dir) => {
        try {
            await mkdir(dir, { recursive: true });
            console.log(`@@@ new directory ${dir} created successfully`);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                console.log(`@@@ directory ${dir} exists`);
            }
        }
    },
    // init directories

    moveFiles: async (old_path, new_path) => {
        try {
            await copyFile(old_path, new_path);
            console.log(`@@@ moved file from ${old_path} to ${new_path} successfully`);
        } catch (err) {
            console.log(`@@@ failed moving file from ${old_path} to ${new_path}`);
            throw err;
        }
        removeFile(old_path);

    },
    removeFile: async (path) => {
        try {
            await unlink(path);
            console.log(`@@@ removed ${path}`);
        } catch (e) {
            console.log(`@@@ failed to remove ${path}`);
            throw e;
        }
    },
    removeFromArray: (array, value) =>
    {
        let index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
};
