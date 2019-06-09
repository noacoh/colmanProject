############################################################
# Dockerfile to build sandbox for executing user code
# Based on Ubuntu
############################################################

FROM ubuntu:16.04

# Update the repository sources list
#RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
#Install all the languages/compilers we are supporting.
RUN apt-get update && apt-get install -y --no-install-recommends\
    software-properties-common \
    gcc \
    g++-4.8 \
    python-software-properties \
    bc \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

#grab oracle java (auto accept licence)
#RUN add-apt-repository -y ppa:webupd8team/java
#RUN apt-get update
#RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
#RUN apt-get install -y oracle-java8-installer \