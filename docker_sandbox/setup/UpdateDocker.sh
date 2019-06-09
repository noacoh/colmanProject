#!/usr/bin/env bash
echo "Creating Docker Image"
docker build -t virtual_machine - < Dockerfile
echo "Retrieving Installed Docker Images"
docker images
