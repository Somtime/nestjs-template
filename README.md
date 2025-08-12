# Nestjs Default Setting

### Production

```bash
# compile
$ npm run build

# start
$ npm run start:prod

# stop
$ npm run stop:prod

# restart
$ npm run restart:prod

# pm2 status
$ npm run status:prod

# log
$ npm run log
```

### Development

```bash
# start
$ npm run start:dev

# init - db, host 등 기본 설정
$ npm run init

# git 커밋 템플릿 설정
$ git config commit.template .gitmessage
```

### .env

```
APP_NAME=your app name
APP_PORT=your app port number
APP_HOSTNAME=http://127.0.0.1:3000/
DB_DATABASE=your database name
DB_HOSTNAME=127.0.0.1
DB_USERNAME=your database account
DB_PASSWORD=your database password
DB_PORT=3306

JWT_SECRET=jwt-secret-key
BCRYPT_SECRET=bcrypt-secret-key
```
