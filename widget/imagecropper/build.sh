#!/bin/bash

./copy.sh
wait

echo "Setup skinning"
cat ./src/css/skin-sam.css | sed -e 's/sprite\.png/..\/..\/..\/..\/assets\/skins\/sam\/sprite\.png/' > ./src/css/skins/sam/imagecropper-skin.css
wait

echo "Running (ant all)..."
wait
ant all
