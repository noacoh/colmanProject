#!/bin/sh

###########################
# Docker SETUP
###########################
brew update
brew install -y docker.io

echo "Docker Setup complete"

###########################
# NodeJS setup
###########################
brew update
brew install -y nodejs
brew install -y npm
echo "NodeJS setup Complete"

###########################
# Start Docker
###########################
chmod 777 ../API/DockerTimeout.sh
chmod 777 ../API/Payload/script.sh
chmod 777 ../API/Payload/javaRunner.sh
chmod 777 UpdateDocker.sh

systemctl restart docker
./UpdateDocker.sh
