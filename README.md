# homecontrol-fr


Install nodejs
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt install nodejs

Install npm and pm2


Install mongoDB
sudo apt-get install mongodb-server
sudo service mongod start

Install Radio frequence utilities
Copy wiringPi to raspberry pi
In wiringPi Repo : sudo ./build
In wiringPi/433Utils/rc-switch : make
Copy piHomeeasy to raspberry pi
In piHomeEasy repo: sudo make install

Run the app
Copy the pub folder to raspberry pi
