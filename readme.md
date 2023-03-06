### env setup

yarn add knex pg @types/pg
yarn knex init -x ts

### database connection

npx gen-env .

DB_NAME=wear
DB_USERNAME=postgres
DB_PASSWORD=postgres

### database setup

run

1. Plain SQL
   ../database folder/wear.session.sql
   or
2. SQL Query Builder : knex sql
   yarn knex migrate:up

### local 8080

yarn install
yarn run dev

//yarn add sqlite3 --save

### python 8000

(set virtual environment)
pyenv local (python version)
python -m venv (name)
.\(name)\Scripts\activate
deactivate

pip install sanic
pip install sanic_cors
pip install requests
pip install diffusers
pip install transformers
pip install accelerate
pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu117

.\badvenv\Scripts\activate

### test credit card

stripe credit card
test@test.test
4242 4242 4242 4242
03 / 30
333
qqq
