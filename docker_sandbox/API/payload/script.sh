#!/bin/bash

########################################################################
#	- This is the main script that is used to compile/interpret the source code
#	- The script takes 3 arguments
#		1. The compiler that is to compile the source file.
#		2. The source file that is to be compiled/interpreted
#		3. Additional argument only needed for compilers, to execute the object code
#
#	- Sample execution command:   $: ./script.sh g++ file.cpp ./a.out
#
########################################################################

#compiler=$1
#file=$2
#additionalArg=$3
#output=$4

CLEAR='\033[0m'
RED='\033[0;31m'

function usage() {
  if [[ -n "$1" ]]; then
    echo -h "${RED}👉 $1${CLEAR}\n";
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
#3>&1 4>&2 >

while [[ "$#" -gt 0 ]]; do case $1 in
  -c|--compiler) compiler="$2"; echo compiler:${compiler};  shift;;
  -f|--files) files="$2"; echo files:${files}; shift;;
  -a|--additional) additionalArgs="$2"; echo additionalArgs:${additionalArgs};  shift;;
  -e|--exec) output="$2"; echo output=${output}; shift;;
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
        ${compiler} ${files} -< $"inputFile" #| tee /usercode/output.txt
    else
        ${compiler} ${files}
    fi
#Branch 2
else
	#In case of compile errors, redirect them to a file
    ${compiler} ${files} ${additionalArgs} #&> /usercode/errors.txt
	#Branch 2a
	if [[ $? -eq 0 ]];	then
	    if [[ -f "inputFile" ]]; then #check if inputFile exists
		    ${output} -< $"inputFile" #| tee /usercode/output.txt
		else
		    ${output}
		fi
	#Branch 2b
	else
	    echo "Compilation Failed"
	    #if compilation fails, display the output file
	    #cat /usercode/errors.txt
	fi
fi

#exec 1>&3 2>&4

#head -100 /usercode/logfile.txt
#touch /usercode/completed
END=$(date +%s.%2N)
runtime=$(echo "$END - $START" | bc)


echo "*-ENDOFOUTPUT-*" ${runtime}


mv logfile.txt completed