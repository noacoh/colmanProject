const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { readFile, writeFile, access }  = require('fs').promises;

/**
         * @Constructor
         * @variable DockerSandbox
         * @description This constructor stores all the arguments needed to prepare and execute a Docker Sandbox
         * @param {Number} timeout: The Time_out limit for code execution in Docker
         * @param {String} path: The current working directory where the current API folder is kept
         * @param {String} folder: The name of the folder that would be mounted/shared with Docker container, this will be concatenated with path
         * @param {String} vm_name: The TAG of the Docker VM that we wish to execute
         * @param {String} compiler: The compiler/interpreter to use for carrying out the translation
         * @param {String} file_name: The file_name to which source code will be written
         * @param {String} code: The actual code
         * @param {String} output_file: Used in case of compilers only, to execute the object code, send " " in case of interpreters
*/
const DockerSandbox = function(timeout, path, folder, vm_name, compiler, file_name, code, output_file, language, compiler_args, stdin) {
    this.timeout = timeout;
    this.path = path;
    this.folder = folder;
    this.vm_name = vm_name;
    this.compiler = compiler;
    this.file_name = file_name;
    this.code = code;
    this.output_file = output_file;
    this.language = language;
    this.flags = compiler_args;
    this.stdin = stdin;
};

DockerSandbox.prototype.getBasePath = () => {
    return `${this.path}${this.folder}`;
};
/**
         * @function
         * @name DockerSandbox.run
         * @description Function that first prepares the Docker environment and then executes the Docker sandbox
         * @param {Function ref} success
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
         * @name DockerSandbox.prepare
         * @description Function that creates a directory with the folder name already provided through constructor
         * and then copies contents of folder named Payload to the created folder, this newly created folder will be mounted
         * on the Docker Container. A file with the name specified in file_name variable of this class is created and all the
         * code written in 'code' variable of this class is copied into this file.
         * Summary: This function produces a folder that contains the source file and 2 scripts, this folder is mounted to our
         * Docker container when we run it.
*/
DockerSandbox.prototype.set = async function() {
    console.log('@@@ setting input and output files');
    const sandbox = this;
    const basePath = sandbox.getBasePath();
    // set file path to hold the code file
    const sourceFilePath =`${basePath}/${sandbox.file_name}`;
    // create new directory
    // copy payload to directory
    // set permission for directory
    const cmd = `mkdir ${basePath} && cp ${sandbox.path}/Payload/* ${basePath} && chmod 777 ${basePath}`;
    await exec(cmd);
    console.log(`@@@ new directory ${basePath} created`);

    // write code to source file
    await writeFile(sourceFilePath, sandbox.code);

    console.log(`${sandbox.language}  code file created at ${sourceFilePath}`);
    await exec(`chmod 777 '${sourceFilePath}'`);

    await writeFile(`${basePath}/inputFile`, sandbox.stdin);
    console.log(`@@@ input file created at ${basePath}/inputFile`);
};

DockerSandbox.prototype.clean = async () => {
    console.log(`@@@ attempting to remove directory: ${sandbox.folder}`);
    await exec(`rm -r ${sandbox.folder}`);
};

/**
         * @function
         * @name DockerSandbox.execute
         * @precondition: DockerSandbox.prepare() has successfully completed
         * @description: This function takes the newly created folder prepared by DockerSandbox.prepare() and spawns a Docker container
         * with the folder mounted inside the container with the name '/usercode/' and calls the script.sh file present in that folder
         * to carry out the compilation. The Sandbox is spawned ASYNCHRONOUSLY and is supervised for a timeout limit specified in timeout_limit
         * variable in this class. This function keeps checking for the file "Completed" until the file is created by script.sh or the timeout occurs
         * In case of timeout an error message is returned back, otherwise the contents of the file (which could be the program output or log of
         * compilation error) is returned. In the end the function deletes the temporary folder and exits
         *
         * Summary: Run the Docker container and execute script.sh inside it. Return the output generated and delete the mounted folder
         *
         * @param {Function pointer} success ?????
*/

DockerSandbox.prototype.execute = async function(success, onError)
{
    const basePath = this.getBasePath();
    const cmd = `${this.path}DockerTimeout.sh ${this.timeout} -u root -i -t -v "${basePath}":/usercode ${this.vm_name} /usercode/script.sh ${this.compiler} ${this.file_name} ${this.output_file} ${this.flags}`;
    const outputFilePath = `${this.path}${this.folder}/completed`;

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

    console.log(`@@@ reading err output from file ${basePath}/errors`);
    try{
        await access(`${basePath}/errors`);
    } catch(err){
        console.log(`@@@ missing compilation errors file ${`${basePath}/errors`}`);
        onError(err);
    }

    const compilationErr = await readFile( `${basePath}/errors`, 'utf8');
    const [ output, time ] = data.toString().split('*-ENDOFOUTPUT-*');

    success(output, time, compilationErr);
};

module.exports = DockerSandbox;
