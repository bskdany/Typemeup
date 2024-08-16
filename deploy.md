from crontab -e

* * * * * /bin/bash ~/typemeup/deploy.sh >> ~/typemeup/deployment.log 2>&1
