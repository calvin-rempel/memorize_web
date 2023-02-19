#!/bin/sh
ls -1 kjv > kjvlist.txt

while read line; do
  name=$(echo "$line".txt)
  mv kjv/$line kjv/$name
done <kjvlist.txt