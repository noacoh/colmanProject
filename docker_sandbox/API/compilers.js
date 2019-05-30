exports.compilers = {
		python: ["python", "file.py", "", "Python", ""],
		gplusplus: ["\'g++ -o /usercode/a.out\' ", "file.cpp", "/usercode/a.out", "C/C++", ""],
		java: ["javac", "file.java", "\'./usercode/javaRunner.sh\'", "Java", ""],
		bash: ["/bin/bash", "file.sh", " ", "Bash", ""],
		gcc: ["gcc ", "file.m", " /usercode/a.out", "Objective-C", "\' -o /usercode/a.out -I/usr/include/GNUstep -L/usr/lib/GNUstep -lobjc -lgnustep-base -Wall -fconstant-string-class=NSConstantString\'"]
};


