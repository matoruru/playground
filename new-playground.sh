#!/bin/bash

set -eu

playgroundName=
prefix='playground-'

while [[ -z "$playgroundName" ]]; do
  read -p "Name of the new playground?: (descriptive one is better) " playgroundName
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