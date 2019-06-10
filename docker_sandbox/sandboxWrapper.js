const sandBox = require('./API/DockerSandbox');
const { readFile }  = require('fs.promises');
const { logger } = require('../configuration/winston');

module.exports = {
  runInSandbox: async (source_dir, input_file, compilation_line, timeout) => {

      const vm_name = 'virtual_machine'; // name of the virtual machine
      const timeout_value = timeout ? timeout : 300; // default timeout in is 5 minutes
      let input;
      try {
          // read file content into a buffer
           input = await readFile(input_file);
      } catch (err) {
          logger.error(`failed to read from file ${input_file}.[${err.toString()}]`);
          throw err;
      }
      logger.info('initiating sandBox', {timeout_value, vm_name, source_dir, compilation_line});
      const sandBox = new sandBox(timeout_value, vm_name, source_dir, compilation_line, input);

      //the result maybe normal program output, list of error messages or a Timeout error
      let [output, execTime, error] = [null, null, null];
      logger.info(`running sandbox... may Halisi be with us`);
      await sandBox.run(function(data ,execTime ,error)
      {
          this.output = data;
          this.execTime = execTime;
          this.error = error;
      }, function(err){
          logger.error('failed to run files in docker sandbox');
          throw err;
      });
      return {
          output,
          execTime,
          error
      };
  }
};
