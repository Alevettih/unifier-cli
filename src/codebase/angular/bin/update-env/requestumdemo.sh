#!/bin/bash
read_var() {
  VAR=$(grep $1 $2 | xargs)
  IFS="=" read -ra VAR <<< "$VAR"
  echo "${VAR[1]}"
}

USERNAME=$(read_var INSTANCE_USERNAME $1)
PASSWORD=$(read_var INSTANCE_PASSWORD $1)
HOST="${USERNAME}.requestumdemo.com"
DEPLOY_PATH="/data/www/vhosts/${USERNAME}/htdocs"

sshpass -p "${PASSWORD}" ssh -t "${USERNAME}@${HOST}" "rm -rf ${DEPLOY_PATH}/*"
sshpass -p "${PASSWORD}" scp -o stricthostkeychecking=no -r ./dist/${2}* "${USERNAME}@${HOST}:${DEPLOY_PATH}"

printf "Uploaded...\n\n";
