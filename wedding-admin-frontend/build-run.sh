docker build -t golang-backend .
docker run -it --rm  -p 8000:8000 -v /home/kalinek/Desktop/web-projects/wedding-app/wedding-backend/src:/go/src/app/ \
	--name backend-server golang-backend
