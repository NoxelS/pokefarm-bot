#!/bin/sh

node benchmark.js &

while [ 1 ]
do
    node main.js > server.log &
    sleep 600
done
