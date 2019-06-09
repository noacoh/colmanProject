const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { readFile, writeFile, access, copyFile, mkdir }  = require('fs.promises');
const { TEMP } = require('../../configuration/index');


/**
         * @Constructor
         * @variable DockerSandbox
         * @description This constructor stores all the arguments needed to prepare and execute a Docker Sandbox
         * @param {Number} timeout: The Time_out limit for code execution in Docker
         * @param {String} vm_name: The TAG of the Docker VM that we wish to execute
         * @param {String} source_dir: Full path to the directory containing all the code files
         * @param {String} output_file: Used in case of compilers only, to execute the object code, send " " in case of interpreters
         * @param {String} compilation_line: the compilation line to run as bash
*/

const DockerSandbox = function(timeout, vm_name, source_dir, output_file, compilation_line) {
    this.timeout = timeout;
    this.shared_dir = `${TEMP}/` + Date.now();
    this.vm_name = vm_name;
    this.source_dir = source_dir;
    this.output_file = output_file;
    this.compilation_line = compilation_line;
};

/**
 * @function
 * @name DockerSandbox.getSharedDir
 * @description Function that returns the designated path to the directory shared with docker
 */
DockerSandbox.prototype.getSharedDir = () => {
    return this.shared_dir;
};
/**
         * @function
         * @name DockerSandbox.run
         * @description Function that first prepares the Docker environment and then executes the Docker sandbox
         * @param {Function} success
         * @param {Function} onError
*/
DockerSandbox.prototype.run = async function(success, onError)
{
    console.log('---------------------');
    await this.set();
    await this.execute(success, onError);
    await this.clean();
    console.log('---------------------');
};


/**
         * @function
         * @name DockerSandbox.set
         * @description Function that creates a shared directory with docker, as declared in the constructor,
         * and then copies contents of the 'Payload' folder and contents of the resource folder to the created folder.
         * The shared folder will be mounted on the Docker Container.
         * Summary: This function produces a folder that contains the source files and 2 scripts, this folder is mounted to our
         * Docker container when we run it.
*/
DockerSandbox.prototype.set = async function() {
    console.log('@@@ setting input and output files');
    const sandbox = this;
    const sharedDir = sandbox.getSharedDir();
    // create new directory
    await exec(`mkdir -p ${sharedDir}`);
    console.log(`@@@ new directory ${sharedDir} created`);
    // copy payload and files in source directory to the shared directory
    await exec(`cp ../Payload/* ${sharedDir} && cp ${sandbox.source_dir}/* ${sharedDir} && chmod 777 ${sharedDir}`);

    await writeFile(`${sharedDir}/inputFile`, sandbox.stdin);
    console.log(`@@@ input file created at ${basePath}/inputFile`);
};

DockerSandbox.prototype.clean = async () => {
    console.log(`@@@ attempting to remove directory: ${sandbox.folder}`);
    await exec(`rm -r ${this.getSharedDir()}`);
};

/**
         * @function
         * @name DockerSandbox.execute
         * @precondition: DockerSandbox.set() has successfully completed
         * @description: This function takes the newly created folder prepared by DockerSandbox.set() and spawns a Docker container
         * with the folder mounted inside the container with the name '/temp/docker/<date>' and calls the script.sh file present in that folder
         * to carry out the compilation. The Sandbox is spawned ASYNCHRONOUSLY and is supervised for a timeout limit specified in timeout_limit
         * variable in this class. This function keeps checking for the file "Completed" until the file is created by script.sh or the timeout occurs
         * In case of timeout an error message is returned back, otherwise the contents of the file (which could be the program output or log of
         * compilation error) is returned. In the end the function deletes the temporary folder and exits
         *
         * Summary: Run the Docker container and execute script.sh inside it. Return the output generated and delete the mounted folder
         *
         * @param {Function} success ?????
         * @param {Function} onError
*/

DockerSandbox.prototype.execute = async function(success, onError)
{
    const sharedDir = this.getSharedDir();
    const cmd = `${this.path}DockerTimeout.sh ${this.timeout} -u root -v ${sharedDir}:/${sharedDir} -w ${sharedDir}  
                 ${this.vm_name} ./script.sh ${this.compilation_line} ./${this.output_file}`;
    const outputFilePath = `${sharedDir}/completed`;

    console.log(`@@@ executing ${cmd}`);
    await exec(cmd);

    try{
        await access(outputFilePath);
    } catch(err){
        console.log(`@@@ missing output file ${outputFilePath}`);
        onError(err);
    }

    console.log(`@@@ reading output from file ${outputFilePath}`);
    const data = await readFile(outputFilePath, 'utf8');

    console.log(`@@@ reading err output from file ${sharedDir}/errors`);
    try{
        await access(`${sharedDir}/errors`);
    } catch(err){
        console.log(`@@@ missing compilation errors file ${`${sharedDir}/errors`}`);
        onError(err);
    }

    const compilationErr = await readFile( `${sharedDir}/errors`, 'utf8');
    const [ output, time ] = data.toString().split('*-ENDOFOUTPUT-*');

    success(output, time, compilationErr);
};

module.exports = DockerSandbox;
