# asterisk-ws-react

## Обзор
Проект по созданию интеграции браузера с Asterisk базе ***Front*** ([React](https://reactjs.org/) + [Redux](https://redux.js.org/)) + ***Back*** ([OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) [Swagger](https://swagger.io/)).

- ***Front***
  - инструментарий для компиляции ***ES6+JSX*** в браузерную библиотеку
  - библиотека "живет" в браузере, общается с ***Back*** через REST API + WebSocket
- ***Back***
  - стыкуется с ***AMI Asterisk***
  - стыкуется с ***MySQL*** для наполнения Asterisk events дополнительной smart-информацией
  - обслуживает ***WebSocket сервер***
  - обслуживает ***REST API сервер***

Собираю в Docker-контейнерах на машине с IP=192.168.13.97.









# 1. MySQL-Server (контейнер mysql-server)
Для работы сервиса нужна база данных. Разворачиваю в контейнере.

База данных содержит
- AAA таблицы для авторизации, аутентификации, аккаунтинга

## Установка
Docker [doc](https://github.com/mysql/mysql-docker)

Мой контейнер был установлен и связан с хостовой директорией ***~/share/mysql***
```bash
mkdir -p ~/share/mysql

sudo docker run \
  --name mysql-57 \
  -d \
  -p 3306:3306 -p 33060:33060 \
  -v ~/share/mysql:/mnt/mysql \
  mysql/mysql-server:5.7

# смотрим пароль root
sudo docker logs mysql-57 2>&1 | grep GENERATED
# работаем с базой
sudo docker exec -it mysql-57 mysql -uroot -p
```

Меняем праоль у root, делаем пользователя ***admin*** для входа с любых IP.
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootpass';
CREATE USER 'admin'@'%' IDENTIFIED BY 'adminpass';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';
FLUSH PRIVILEGES;
SELECT User, Host FROM mysql.user;
```
выходим из bash контейнера ***Ctrl+D***

Создаем базу ***asterisk-ws-react***
```bash
sudo docker exec -it mysql-57 bash
  mysql -uadmin -padminpass
```

```sql
CREATE DATABASE `asterisk-ws` DEFAULT CHARACTER SET utf8;
SHOW DATABASES;
```


В **MySql Workbench 8.0** возникнут проблемы import/export при работе с сервером версии 5.7. Нужен подходящий **mysqldump.exe**:
- Качаем [MySQL Community Server 5.7](https://dev.mysql.com/downloads/mysql/) - выкавыриваем из архива mysqldump.exe
- Edit > Preferences > Administration : Path to mysqldumptool - прописываем путь

выложил у себя [mysqldump-5-7-24.exe](https://github.com/ars-anosov/asterisk-ws-react/blob/master/mysql/)

## backup/restore
В контейнере mysql-57 создаем директорию под проект asterisk-ws-react
```
mkdir -p ~/share/mysql/asterisk-ws-react
```

Хостовая машина, директория ***asterisk-ws-react***
```bash
cd asterisk-ws-react

# backup
sudo docker exec -it mysql-57 bash
  mysqldump -uadmin -padminpass asterisk-ws > /mnt/mysql/asterisk-ws-react/structure_and_data.sql
  [Ctrl+D]
cp ~/share/mysql/asterisk-ws-react/*.sql mysql/

# restore
sudo cp mysql/*.sql ~/share/mysql/asterisk-ws-react/
sudo docker exec -it mysql-57 bash
  mysql -uadmin -padminpass asterisk-ws < /mnt/mysql/asterisk-ws-react/structure_and_data.sql
  [Ctrl+D]
```








# 2. Среда разработки back/front (контейнер node)
Работал в следующем окружении:
- **asterisk-ws-react** - Docker-контейнер NodeJS v.10
- **9229** - TCP Port для Node Debug
- **AMI_HOST** - Asterisk IP
- **AMI_PORT** - Asterisk AMI Port
- **AMI_USER** - Asterisk AMI User
- **AMI_SECRET** - Asterisk AMI Secret
- **OPENAPI_PORT=8018** - REST API порт Back-сервера
- **WS_PORT=8019** - WebSocket порт Back-сервера
- **DB_HOST** - MySQL сервер IP
- **DB_USER** - MySQL user
- **DB_PASS** - MySQL password

## Docker
Хостовая машина, директория ***asterisk-ws-react***
```bash
cd asterisk-ws-react

sudo docker run \
  --name asterisk-ws-react \
  --link mysql-57:mysql-57 \
  -v $PWD:/asterisk-ws-react \
  -w /asterisk-ws-react \
  -e "AMI_HOST=192.168.30.29" -e "AMI_PORT=5038" -e "AMI_USER=helpdesk" -e "AMI_SECRET=helpdeskadmin" \
  -e "OPENAPI_PORT=8018" -e "WS_PORT=8019" \
  -e "DB_HOST=mysql-57" -e "DB_USER=admin" -e "DB_PASS=adminpass" \
  -p 8018:8018 -p 8019:8019 \
  -p 9229:9229 \
  -it \
  node:10 bash
```
Выскочить из контейнера : ***Ctrl+P+Q***

Дальше все действия внутри контейнера
```bash
sudo docker exec -it asterisk-ws-react bash

# Таскер (в нем же и компилирую ES6) https://github.com/gulpjs/gulp
npm install -g gulp-cli

# Для запуска сервисов https://github.com/Unitech/pm2
npm install -g pm2

# Для проверки npm обновлений https://github.com/tjunnone/npm-check-updates
npm install -g npm-check-updates

# Для тестирования WebSocket
npm install -g wscat
```
Закончить bash-сессию в контейнере : ***Ctrl+D***









# 2.1. Backend
OpenAPI-сервер обрабатывает REST-запросы, воздействует на Asterisk. WebSocket-сервер транслирует Asterisk events, дополняет их smart-данными о звонке (берет из базы абонентов).

## Установка
Директория ***node_back***
```bash
sudo docker exec -it asterisk-ws-react bash
cd /asterisk-ws-react/node_back

# Проверить обновления
ncu
# обновить package.json если хочется
ncu -u

npm install
```

### Локальные правки
Если разворачиваем на **production** сервере, например **10.229.x.x**
1. Правим поле ***host*** в [node-back/api/swagger.yaml](https://github.com/ars-anosov/asterisk-ws-react/blob/master/node_back/api/swagger.yaml)
```bash
sed -i -e "s/host: '192.168.13.97:8018'/host: '10.229.x.x:8018'/" api/swagger.yaml
```
2. Правим ***localStorage[specUrl, wsUrl]*** готового build в [index.html](https://github.com/ars-anosov/asterisk-ws-react/blob/master/node-back/build_front/index.html)
```JavaScript
    window.localStorage.setItem('apiUrl', 'http://192.168.13.97:8018')
    window.localStorage.setItem('wsUrl', 'ws://192.168.13.97:8019')
```
```bash
sed -i -e "s/http:\/\/192.168.13.97:8018/http:\/\/10.229.x.x:8018/" ../web_front/build/index.html
sed -i -e "s/ws:\/\/192.168.13.97:8019/ws:\/\/10.229.x.x:8019/" ../web_front/build/index.html
```

## Запуск
```bash
pm2 start index.js \
  --name back --watch ./controllers --restart-delay 1000 --node-args="--inspect=0.0.0.0:9229" \
  -- $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT $WS_PORT $DB_HOST $DB_USER $DB_PASS
pm2 logs back

# либо без посредников, с отладкой в консоль
node --inspect=0.0.0.0:9229 index.js \
  $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT $WS_PORT $DB_HOST $DB_USER $DB_PASS
```
выходим из bash контейнера ***Ctrl+D***

С этого места Backend работает, перезагружает сервис при изменении файлов в ./controllers.

### Проверки
- WEB-интерфейс для тестовых запросов через **Swagger-UI** - [192.168.13.97:8018/spec-ui/](http://192.168.13.97:8018/spec-ui/)
- **OpenAPI-Spec** файл доступен - [192.168.13.97:8018/spec/swagger.json](http://192.168.13.97:8018/spec/swagger.json)
- **API** принимает REST-запросы - [192.168.13.97:8018/v2api](http://192.168.13.97:8018/v2api/)
```bash
curl -X GET -H "accept: application/json" \
  "http://192.168.13.97:8018/v2api/client/token?auth_name=aa&auth_pass=bb"
```
- **WebSocket** тестовый HTML - [192.168.13.97:8018/ws_test](http://192.168.13.97:8018/ws_test)
```bash
wscat -c "ws://192.168.13.97:8019"
```
- **chrome://inspect** - Discover network targets -> Configure: 192.168.13.97:9229









# 2.2. Frontend
Компиляция JS библиотеки для браузера в директорию ***web_front/build***

## Установка
Директория ***web_front***
```bash
sudo docker exec -it asterisk-ws-react bash
cd /asterisk-ws-react/web_front

# обновляемся в package.json
ncu
ncu -u
# чистим package.json от лишних пресетов Babel
# https://babeljs.io/docs/en/next/v7-migration
npx babel-upgrade

cd src/js/components
ncu
ncu -u

# устанавливаем
cd /asterisk-ws-react/web_front
npm install
npm run install-components
```

## Запуск
Компилируем build
```bash
cd /asterisk-ws-react/web_front
gulp
# production build
gulp --production
```

### Результат
С этого места Frontend компилирует build при изменении файлов в gulp.watch

Готовый build - [http://192.168.13.97:8018/front_build/](http://192.168.13.97:8018/front_build/)

обновляем руками: ***Ctrl+Shift+R***









# 3. Deploy
Размещаем сервисы на Production машину с помощью rsync.

## Установка
Мы все еще в контейнере
```bash
apt update
apt install rsync

ssh-keygen

# публичный SSH-ключ этого контейнера вписываем на каждую удаленную машину в authorized_keys
scp /root/.ssh/id_rsa.pub ars@192.168.28.18:~/
ssh -t ars@192.168.28.18 'cat id_rsa.pub >> ~/.ssh/authorized_keys'
```

## Deploy
Директория ***asterisk-ws-react***
```bash
cd asterisk-ws-react

# Backend
gulp reactor:deploy

# Frontend
gulp build:deploy
```









# 4. asterisk-ws-react-component
Компиляция React-компонент в отдельную NPM-библиотеку

### Компилируем
Мы все еще в контейнере. Директория ***[web_front/src/js/components](https://github.com/ars-anosov/asterisk-ws-react/tree/master/web_front/src/js/components)***
```bash
cd web_front/src/js/components

gulp clean
gulp
```

### Публикуем на [npmjs.org](https://www.npmjs.com/package/asterisk-ws-react-component)

```bash
grep version package.json
sed -i -e 's/"version": "2.0.1"/"version": "2.0.2"/' package.json

npm login
npm publish
```