FROM golang:1.14.2

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y git wget make git autoconf automake libtool gettext \
 			g++ texinfo curl sqlite3 libsqlite3-dev gcc build-essential g++ musl-dev

WORKDIR /root
COPY ./fswatch-setup.sh .
RUN  ./fswatch-setup.sh

#CMD make -C /root watch
CMD make -C /root run