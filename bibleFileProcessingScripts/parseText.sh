#!/bin/sh
bookcount="000"
currentBookName=""

while read line; do
  filename=$(echo "$line"|cut -d: -f1)
  verse=$(echo "$line"|cut -d: -f2|sed 's/^[0-9]* //g')
  book=$(echo "$line"|cut -d: -f1|sed 's/[0-9]*$//g')
  chapter=$(echo "$filename"|sed 's/^[0-9]*//g'|sed 's/[a-zA-Z]*//g')
 
  if [ "$book" != "$currentBookName" ]; then
    bookcount=$(expr $bookcount + 1)
    currentBookName=$book
  fi

  #Construct filename adding leading zeros for nice file sorting.
  if [ $bookcount -lt 10 ]; then
    #Leading Zeros for Chapter and book number   
    if [ $chapter -lt 10 ]; then
        filename=$(echo "0$bookcount"_"$book"00"$chapter")
    elif [ $chapter -lt 100 ]; then
        filename=$(echo "0$bookcount"_"$book"0"$chapter")
    else
        filename=$(echo "0$bookcount"_"$book$chapter")
    fi
  else
    #Leading Zeros for Chapter but none for book number
    if [ $chapter -lt 10 ]; then
        filename=$(echo "$bookcount"_"$book"00"$chapter")
    elif [ $chapter -lt 100 ]; then
        filename=$(echo "$bookcount"_"$book"0"$chapter")
    else
        filename=$(echo "$bookcount"_"$book$chapter")
    fi
  fi

  #Output verse to the appropriate file.
  echo "$verse">>kjv/$filename
done <kjv.txt