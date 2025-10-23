#!/bin/bash
cd /home/rg/Documents/Code/magic_academy || exit 1
git pull origin main
docker stop magic-academy
dockr rm magic-academy
docker build -t magic-academy-site .
docker run -d --name magic-academy -p 8080:80 magic-academy-site
