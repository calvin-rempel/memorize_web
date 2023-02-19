#!/bin/sh
bookcount="000"
currentBookName=""

ls -1 kjv > kjvlist.txt

while read line; do
  booknum=$(echo $line|cut -d_ -f1)
  echo $line >> $booknum
done <kjvlist.txt