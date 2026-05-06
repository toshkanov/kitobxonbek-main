#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20
cd /home/toshkanov/Downloads/kitobxonbek-main
nohup npx next dev --port 3000 > /tmp/nextjs.log 2>&1 &
echo "Next.js PID: $!"
