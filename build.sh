#!/bin/bash

clear(){
    echo "1. 清理操作..."
    rm -rf public
    rm -rf docs
}

build(){
    echo "2. build操作..."
    yarn build
    cp -r public docs
}

clear
build
