const sandBox = require('./API/DockerSandbox');


module.exports = {
  runInSandbox: async (source_dir, studentId) => {

      //const shared_dir = `${TEMP}/` + Date.now(); //folder in which the temporary folder will be saved
      //const path = __dirname + "/"; // current working path
      const vm_name = 'virtual_machine'; // name of virtual machine that we want to execute
      const timeout_value = 300; // timeout in seconds (5 mins)
      //TODO update with real params
      const file_name = studentId;
      const { compilation_line } = compilation_line;

      const sandBox = new sandBox(timeout_value, vm_name, source_dir, file_name, compilation_line);

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
