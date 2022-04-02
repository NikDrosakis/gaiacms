#!/bin/bash
:set ff=unix
:wq
#if in the same server
echo "installing templates to $2"
mkdir -pv 777 "$2"
cp -R "$1" "$2"
