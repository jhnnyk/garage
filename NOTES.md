* go to repo on Github
  * Settings > Integrations & services > Add service > Travis CI
* go to `https://travis-ci.org/` and connect Travis to repo
  * might need to re-sync to Github to find repo in Travis
* add `.travis.yml` file with the following contents:
```
language: node_js
node_js: node
services:
- mongodb
```
* `travis setup heroku`
* `heroku create`
  * copy the heroku app name and paste it into the `deploy:app:` setting in `.travis.yml`

* go to mLab and provision a new DB
  * add a user for this DB
* visit Heroku dashboard
  * click `Settings`, then `Reveal Config Vars`
    * create an entry for `DATABASE_URL` with the value `mongodb://<dbuser>:<dbpassword>@ds99999.mlab.com:9999/node-restaurants-app` replacing the values for your DB and DB user

* commit and push changes to `master` and TravisCI should run tests and push to Heroku!

---
* import seed data to local database
  * `mongoimport --db garage --collection fillups --drop --file ~/dev/Thinkful/server-side-js/garage/data/seedData.json`
  * imported cars with `mongoimport --db garage --collection cars --drop --file ~/dev/Thinkful/server-side-js/garage/data/carSeedData.json`
