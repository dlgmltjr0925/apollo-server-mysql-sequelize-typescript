#!/bin/bash

echo "Initializing framework. Please wait."

PROJECT_ROOT=$(pwd)

echo -n "[Copy config file]"
cp $PROJECT_ROOT/src/configs/index.sample.ts $PROJECT_ROOT/src/configs/index.ts
echo -e "\r[Copy config file][Done]"

