#!/bin/bash

cd ..
npm i
npm run build

cp -r ./.nuxt building/nuxt
cp -r ./static building/
cp ./package.json building/
cp ./nuxt.config.js building/

echo "#!/bin/bash" >> building/start.sh
echo "" >> building/start.sh
echo "npm i" >> building/start.sh
echo "NUXT_HOST=0.0.0.0 BASE_URL=\$BASE_URL npm start > last.log" >> building/start.sh

chmod +x building/start.sh
