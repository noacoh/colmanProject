const sandBox = require('./API/DockerSandbox');
const { compliers } = require('./API/compilers');

module.exports = {
  runInSandbox: async (language, code, stdin) => {

      const  folder = 'temp/' + random(10); //folder in which the temporary folder will be saved
      const  path = __dirname + "/"; // current working path
      const vm_name = 'vm'; // name of virtual machine that we want to execute
      const timeout_value = 60000; // timeout in milliseconds
      const [ compiler_name, file_name, languageName, output_command, extra_arguments ] = compliers.get(language)

      const sandboxType = new sandBox(timeout_value, path, folder, vm_name, compiler_name, file_name, code, languageName, output_command, extra_arguments, stdin);

      //data will contain the output of the compiled/interpreted code
      //the result maybe normal program output, list of error messages or a Timeout error
      let output, execTime, error;
      await sandboxType.run(function(data ,exec_time ,err)
      {
          output = data;
          execTime = exec_time;
          error = err;

      });

      return {
          output,
          execTime,
          error
      };
  }
};
