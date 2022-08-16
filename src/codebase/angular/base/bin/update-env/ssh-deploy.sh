#!/bin/bash
read_var() {
  VAR=$(grep $1 $2 | xargs)
  IFS="=" read -ra VAR <<< "$VAR"
  echo "${VAR[1]}"
}

USERNAME=$(read_var INSTANCE_USERNAME $1)
KEY=$(read_var INSTANCE_KEY $1)
PASSWORD=$(read_var INSTANCE_PASSWORD $1)
HOST=$(read_var INSTANCE_HOST $1)
DEPLOY_PATH=$(read_var INSTANCE_DEPLOY_PATH $1)

echo ${KEY}
echo ${PASSWORD}

if [ ! -z $KEY ]; then
  echo "Deploy with key"

  ssh -i "${KEY}" -t ${USERNAME}@${HOST} "rm -rf ${DEPLOY_PATH}/*"
  scp -i "${KEY}" -r ./dist/${2}* ${USERNAME}@${HOST}:${DEPLOY_PATH}
elif [ ! -z $PASSWORD ]; then
  echo "Deploy with password"

  sshpass -p "${PASSWORD}" ssh -t "${USERNAME}@${HOST}" "rm -rf ${DEPLOY_PATH}/*"
  sshpass -p "${PASSWORD}" scp -o stricthostkeychecking=no -r ./dist/${2}* "${USERNAME}@${HOST}:${DEPLOY_PATH}"
else
  echo "Key or password is not found"
fi


printf "Operation end...\n";
