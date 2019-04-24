#!/bin/bash
rm -rf docs
yarn build
cp -r public docs