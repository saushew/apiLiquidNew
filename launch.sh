#!/bin/bash
#

cd ../liquidbot

if [ "$1" = "" ]; then
  echo "Empty path"
  exit 1
fi

basedir=$PWD
cd $1
if [ $? -ne 0 ]; then
  exit 2
fi

if [ ! -f "settings.json" ]; then
  echo "No settings.json file"
  exit 3
fi

dir=$PWD

name=$(basename "$1")

if [ "$name" = "" ]; then
  echo "Empty name"
  exit 4
fi


newprogram="./$name"

PID=`ps -aef | grep " $newprogram$" | grep -v grep | awk '{print $2}'`
echo "pid = $PID"

if [ "$PID" != ""  ]
then 
echo "There is already a program run stop.sh"
exit 5
fi

cd $basedir

go build -o "$dir/$name"

cd $dir

exec "./$name" &

sleep 1

disown 

echo "OK"
