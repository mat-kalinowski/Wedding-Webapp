FROM golang:1.13

RUN apt-get update && apt-get upgrade
RUN apt-get install -y git wget make git autoconf automake libtool gettext \
 			g++ texinfo curl sqlite3 libsqlite3-dev

WORKDIR /root
COPY ./fswatch-setup.sh .
RUN  ./fswatch-setup.sh

CMD make -C /go/src/app watch
