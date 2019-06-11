const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { readFile, writeFile, access }  = require('fs.promises');
const { resources } = require('../../configuration');
const { logger } = require('../../configuration/winston');

/**
         * @Constructor
         * @variable DockerSandbox
         * @description This constructor stores all the arguments needed to prepare and execute a Docker Sandbox
         * @param {Number} timeout: The Time_out limit for code execution in Docker
         * @param {String} vm_name: The TAG of the Docker VM that we wish to execute
         * @param {String} source_dir: Full path to the directory containing all the code files
         * @param {String} compilation_line: the compilation line to run as bash
*/

const DockerSandbox = function(timeout, vm_name, source_dir, compilation_line) {
    this.timeout = timeout;
    this.shared_dir = `${resources.docker.temp}/temp${Date.now()}`;
    this.vm_name = vm_name;
    this.source_dir = source_dir;
    this.compilation_line = compilation_line;
    this.container_dir = resources.docker.container_dir;
};

/**
 * @function
 * @name DockerSandbox.getSharedDir
 * @description Function that returns the designated path to the directory shared with docker
 */
DockerSandbox.prototype.getSharedDir = () => {
    return this.shared_dir;
};

DockerSandbox.prototype.getContainerDir = () => {
    return this.container_dir;
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
    console.log('----------------------------');
    console.log('@@@ set directories and file');
    await this.set();
    console.log('@@@ run files in sandbox');
    await this.execute(success, onError);
    console.log('@@@ clean directories and file');
    await this.clean();
    console.log('----------------------------');
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
    const sandbox = this;
    console.log('@@@ setting input and output files');
    const sharedDir = sandbox.getSharedDir();
    // create new directory
    await exec(`mkdir -p ${sharedDir}`);
    console.log(`@@@ new directory ${sharedDir} created`);
    // copy payload and files in source directory to the shared directory
    await exec(`cp ${resources.root}docker_sandbox/API/payload/* ${sharedDir} && cp ${sandbox.source_dir}/* ${sharedDir} && chmod 777 ${sharedDir}`);
};
/**
 * @function
 * @name DockerSandbox.addInput
 * @description
 * @param {Buffer} input
 */
DockerSandbox.prototype.addInput = async (input) => {
    const sandbox = this;
    const sharedDir = sandbox.getSharedDir();
    // writes the input
    await writeFile(`${sharedDir}/inputFile`, input);
    console.log(`@@@ input file created at ${sharedDir}/inputFile`);
};

DockerSandbox.prototype.clean = async () => {
    const sandbox = this;
    console.log(`@@@ attempting to remove directory: ${sandbox.shared_dir}`);
    await exec(`rm -r ${this.getSharedDir()}`);
};

/**
         * @function
         * @name DockerSandbox.execute
         * @precondition: DockerSandbox.set() has successfully completed
         * @description: This function takes the newly created folder prepared by DockerSandbox.set() and spawns a Docker container
         * with the folder mounted inside the container with the name 'resources/docker/temp/<date>' and calls the script.sh file present in that folder
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
    const containerDir = this.getContainerDir();
    // TODO check if this.input exists and execute accordingly
    const cmd = `${this.path}DockerTimeout.sh ${this.timeout} -u root -v ${sharedDir}:/${containerDir} 
                -w ${sharedDir} ${this.vm_name} ./script.sh ${this.compilation_line}`;
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
