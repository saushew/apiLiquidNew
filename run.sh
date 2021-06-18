#!/bin/bash
#
if [ "$1" = "" ]; then
  exit 1
fi

go build -o "$1"

"./$1" &

sleep 1

disown

echo OK
