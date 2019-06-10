const sandBox = require('./API/DockerSandbox');


module.exports = {
  runInSandbox: async (source_dir, compilation_line) => {

      const vm_name = 'virtual_machine'; // name of virtual machine that we want to execute
      const timeout_value = 300; // timeout in seconds (5 mins)

      const sandBox = new sandBox(timeout_value, vm_name, source_dir, compilation_line);

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
