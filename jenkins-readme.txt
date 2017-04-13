###################
#Deployment in UAT#
###################

#Create the repository in which the deployed code will be
mkdir /home/ubuntu/uat/<YOUR APP NAME>


#Create the jenkins job

The job content must content be :

rm -rf pub
rm -rf pub.tar.gz
npm install
bower install
gulp dist
cp -rf node_modules node_modules_temp
npm prune --production
mkdir pub
mv node_modules pub/
mv dist pub/
cp package.json pub/
mv node_modules_temp node_modules
tar -zcvf pub.tar.gz pub


Then a new ssh publisher with the transfer of : pub.tar.gz

And another ssh publisher with an exec :

pkill imt-uat ;
tar -xf  /home/ubuntu/releases/imt/pub.tar.gz -C /home/ubuntu/releases/imt/; rm -rf /home/ubuntu/uat/imt/* ;
mv /home/ubuntu/releases/imt/pub/* /home/ubuntu/uat/imt/ ;
rm /home/ubuntu/releases/imt/pub.tar.gz;
 rm -rf  /home/ubuntu/releases/imt/pub;
cd /home/ubuntu/uat/imt/ && screen -d -m npm run start-uat


Setup the git repository to your code and check the option :
Build when a change is pushed to GitHub

Archive artefacts: pub.tar.gz


#Go to Github and hook the repository of your project to jenkins
