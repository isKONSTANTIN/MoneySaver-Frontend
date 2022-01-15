#!/bin/bash

BASE_URL="https://ms.knst.su/"

npm i
BASE_URL=${BASE_URL} npm run build

mkdir ./deploy
cp -r ./.nuxt deploy/
cp -r ./static deploy/
cp ./package.json deploy/

echo "#!/bin/bash" >> deploy/start.sh
echo "" >> deploy/start.sh
echo "cd ~" >> deploy/start.sh
echo "npm i" >> deploy/start.sh
echo "NUXT_HOST=0.0.0.0 BASE_URL=${BASE_URL} npm start" >> deploy/start.sh

chmod +x deploy/start.sh

zip -r deploy.zip deploy/
rm -r deploy/
