#!/bin/bash

set -eu

playgroundName=
if [ $# -eq 1 ]; then
  playgroundName="$1"
fi

prefix='playgrounds/'

while [[ -z "$playgroundName" ]]; do
  read -p "Name of the new playground?: " playgroundName
done

folderName="$prefix$playgroundName"

echo Creating...
mkdir $folderName
echo "# $folderName" > $folderName/README.md
echo ✨ New playground \"$folderName\" has been created!
ls -la $folderName

git reset
git add $folderName
git commit -m "add: New playground \"$folderName\""