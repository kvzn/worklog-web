#!/usr/bin/env sh

set -e

npm run build

cd dist

echo 'worklog.springup.xyz' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:kevinzheng/worklog-web-dist.git master

cd -
