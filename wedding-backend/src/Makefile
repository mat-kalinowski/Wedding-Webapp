# Makefile designed for docker

PID_FILE=/tmp/golang-app.pid

run:
	kill -9 `cat $(PID_FILE)`
	go get -d -v ./...	
	go install -v ./...
	$(MAKE) migrations -C ./models/migrations
	wedding-backend & echo $$! > $(PID_FILE)

watch: run
	export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/lib" && \
		fswatch -or --event=Updated . | \
		xargs -n1 -I {} make run

.PHONY: run watch
.IGNORE: run
