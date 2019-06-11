const sandBox = require('./API/DockerSandbox');
const { readFile }  = require('fs.promises');
const { logger } = require('../configuration/winston');

module.exports = {
  runInSandbox: async function(source_dir, compilation_line, timeout, input_file) {
      const vm_name = 'virtual_machine'; // name of the virtual machine
      const timeout_value = timeout ? timeout : 300; // default timeout in is 5 minutes
      let input;
      logger.info('initiating sandBox', {timeout_value, vm_name, source_dir, compilation_line});
      const sb = new sandBox(timeout_value, vm_name, source_dir, compilation_line);
      if (input_file) {
          try {
              // read file content into a buffer
              input = await readFile(input_file);
              logger.info(`adding input file ${input_file}`);
              await sb.addInput(input);
          } catch (err) {
              logger.error(`failed to read from file ${input_file}.[${err.toString()}]`);
              throw err;
          }
      }
      //the result maybe normal program output, list of error messages or a Timeout error
      logger.info(`running sandbox... may Halisi be with us`);
      const res =  await sb.run();
      logger.info('@@@@@@@ CAME BACK WITH RESULTS!');
      logger.info(JSON.stringify(res));
      return res;
  }
};
