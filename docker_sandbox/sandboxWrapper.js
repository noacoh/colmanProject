const sandBox = require('./API/DockerSandbox');
const { compilers } = require('./API/compilers');

module.exports = {
  run: async (language, code, stdin) => {

      const folder = 'temp/' + random(10); //folder in which the temporary folder will be saved
      const path = __dirname + "/"; // current working path
      const vm_name = 'vm'; // name of virtual machine that we want to execute
      const timeout_value = 60000; // timeout in milliseconds
      const [ compiler_name, file_name, languageName, outputFile, extra_arguments ] = compilers.get(language);

      const sandBox = new sandBox(timeout_value, path, folder, vm_name, compiler_name, file_name, code, languageName, outputFile, extra_arguments, stdin);

      //the result maybe normal program output, list of error messages or a Timeout error
      let [output, execTime, error] = [null, null, null];
      await sandBox.run(function(data ,execTime ,error)
      {
          this.output = data;
          this.execTime = execTime;
          this.error = error;
      }, function(err){
          throw err;
      });
      return {
          output,
          execTime,
          error
      };
  }
};
