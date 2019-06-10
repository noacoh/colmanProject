#!/bin/bash
CLEAR='\033[0m'
RED='\033[0;31m'

########################################################################
#	- This is the main script that is used to compile/interpret the source code
#	- The script takes 3 arguments
#		1. The compiler that is to compile the source file.
#		2. The source file that is to be compiled/interpreted
#		3. Additional argument only needed for compilers, to execute the object code
#
#	- Sample execution command: ./script.sh --compiler gcc --files "*.c *.h" --additional -Wall -exec ./a.out
#
########################################################################

function usage() {
  if [[ -n "$1" ]]; then
    echo -n "${RED} $1${CLEAR}\n";
  fi
  echo "Usage: $0 [-c compiler-name] [-f files] [-a additional-args] [-e executable]"
  echo "  -c, --compiler            Compiler to use"
  echo "  -s, --files               Files to compile"
  echo "  -a, --additional          Additional compile args"
  echo "  -e, --exec                Output file to execute"
  echo ""
  echo "Example: $0 --compiler gcc --files "'"*.c *.h"'" --additional -Wall -exec ./a.out"
  exit 1
}

########################################################################
#	- The script works as follows
#	- It first stores the stdout and std err to another stream
#	- The output of the stream is then sent to respective files
#
#
#	- if third argument is empty Branch 1 is followed. An interpreter was called
#	- else Branch2 is followed, a compiler was invoked
#	- In Branch2. We first check if the compile operation was a success (code returned 0)
#
#	- If the return code from compile is 0 follow Branch2a and call the output command
#	- Else follow Branch2b and output error Message
#
#	- Stderr and Stdout are restored
#	- Once the logfile is completely written, it is renamed to "completed"
#	- The purpose of creating the "completed" file is because NodeJs searches for this file
#	- Upon finding this file, the NodeJS Api returns its content to the browser and deletes the folder
#
#
########################################################################

exec  1> $"logfile.txt"
exec  2> $"errors"

while [[ "$#" -gt 0 ]]; do case $1 in
  -c|--compiler) compiler="$2"; shift;;
  -f|--files) files="$2"; shift;;
  -a|--additional) additionalArgs="$2"; shift;;
  -e|--exec) output="$2"; shift;;
  *) usage "Unknown parameter passed: $1"; exit 1;;
esac; shift; done

# verify params
if [[ -z "$compiler" ]]; then usage "compiler is not set"; fi;
if [[ -z "$files" ]]; then usage "files are not set"; fi;
if [[ -z "$output" ]]; then usage "executable is not set"; fi;

START=$(date +%s.%2N)
#Branch 1
if [[ "$output" = "" ]]; then
    if [[ -f "inputFile" ]]; then #check if inputFile exists
        ${compiler} ${files} -< $"inputFile"
    else
        ${compiler} ${files}
    fi
#Branch 2
else
	#In case of compile errors, redirect them to a file
    ${compiler} ${files} ${additionalArgs}
	#Branch 2a
	if [[ $? -eq 0 ]];	then
	    if [[ -f "inputFile" ]]; then #check if inputFile exists
		    ${output} -< $"inputFile"
		else
		    ${output}
		fi
	#Branch 2b
	else
	    echo "Compilation Failed"
	fi
fi

END=$(date +%s.%2N)
runtime=$(echo "$END - $START" | bc)

echo "*-ENDOFOUTPUT-*" ${runtime}

mv logfile.txt completed