#!/bin/bash
#
if [ "$1" = "" ]; then
	exit 1
fi

name=$1
program="./$name"

pid=`ps -aef | grep "$program$" | grep -v grep | awk '{print $2}'`
echo "pid = $pid"

if [ "$pid" = "" ]; then
  echo no such program
  exit 1
else
  echo OK
  exit 0
fi
