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
База данных содержит
- AAA таблицы для авторизации, аутентификации, аккаунтинга

## Установка
Docker [doc](https://github.com/mysql/mysql-docker)

Если контейнер с MySQL-сервером уже существует, и надо дополнить его дополнительным **vulume** - создаем с нуля:
- делаем backup данных в предыдущих проектах
- удаляем/пересоздаем контейнер

Хостовая машина, директория ***asterisk-ws-react***
```bash
cd asterisk-ws-react

sudo docker run \
  --name mysql-local-3306 \
  -d \
  -p 3306:3306 -p 33060:33060 \
  -v $PWD/mysql:/mnt/mysql_aster_ws \
  -v /other/projects/mysql:/mnt/mysql_other_data \
  mysql/mysql-server:5.7

# смотрим пароль root
sudo docker logs mysql-local-3306 2>&1 | grep GENERATED
# работаем с базой
sudo docker exec -it mysql-local-3306 mysql -uroot -p
```

Меняем праоль у root, делаем пользователя admin для входа с любых IP.
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootpass';
CREATE USER 'admin'@'%' IDENTIFIED BY 'adminpass';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';
FLUSH PRIVILEGES;
SELECT User, Host FROM mysql.user;

CREATE DATABASE `asterisk_ws` DEFAULT CHARACTER SET utf8;
SHOW DATABASES;
```

В **MySql Workbench 8.0** возникнут проблемы import/export при работе с сервером версии 5.7. Нужен подходящий **mysqldump.exe**:
- Качаем [MySQL Community Server 5.7](https://dev.mysql.com/downloads/mysql/) - выкавыриваем из архива mysqldump.exe
- Edit > Preferences > Administration : Path to mysqldumptool - прописываем путь

выложил у себя [mysqldump-5-7-24.exe](https://github.com/ars-anosov/asterisk-ws-react/blob/master/mysql/)

## backup/restore
```bash
sudo docker exec -it mysql-local-3306 bash

# backup
mysqldump -uadmin -padminpass asterisk_ws > /mnt/mysql_aster_ws/structure_and_data.sql
# restore
mysql -uadmin -padminpass asterisk_ws < /mnt/mysql_aster_ws/structure_and_data.sql
```
выйти Ctrl+D









# 2. Среда разработки back/front (контейнер node)

## Окружение
Работал в следующем окружении:
<AMI-host> <AMI-port> <AMI-user> <AMI-secret> <OpenAPI-port>
- **asterisk-ws-react** - Docker-контейнер NodeJS v.10
- **AMI_HOST** - Asterisk IP
- **AMI_PORT** - Asterisk AMI Port
- **AMI_USER** - Asterisk AMI User
- **AMI_SECRET** - Asterisk AMI Secret
- **OPENAPI_PORT=8018** - http порт на Pruduction машине для OpenAPI запросов к сервису
- **WS_PORT=8019** - WebSocket порт на Pruduction машине
- **DB_HOST** - MySQL сервер IP
- **DB_USER** - MySQL user
- **DB_PASS** - MySQL password

## Docker
Хостовая машина, директория ***asterisk-ws-react***
```bash
cd asterisk-ws-react

sudo docker run \
  --name asterisk-ws-react \
  --link mysql-local-3306:mysql-local-3306 \
  -v $PWD:/asterisk-ws-react \
  -w /asterisk-ws-react \
  -e "AMI_HOST=192.168.30.29" -e "AMI_PORT=5038" -e "AMI_USER=helpdesk" -e "AMI_SECRET=helpdeskadmin" \
  -e "OPENAPI_PORT=8018" -e "WS_PORT=8019" \
  -e "DB_HOST=mysql-local-3306" -e "DB_USER=admin" -e "DB_PASS=adminpass" \
  -p 8018:8018 -p 8019:8019 \
  -it \
  node:10 bash
```

Дальше все действия внутри контейнера. Выскочить из контейнера : Ctrl+P+Q.
```bash
# Таскер (в нем же и компилирую ES6) https://github.com/gulpjs/gulp
npm install -g gulp-cli

# Для запуска сервисов https://github.com/Unitech/pm2
npm install -g pm2

# Для проверки npm обновлений https://github.com/tjunnone/npm-check-updates
npm install -g npm-check-updates

# Для тестирования WebSocket
npm install -g wscat

# Для заливки на удаленные серверы используем утилиту Rsync
apt update
apt install rsync

# публичный SSH-ключ этого контейнера вписываем на каждую удаленную машину в authorized_keys
ssh-keygen
scp /root/.ssh/id_rsa.pub ars@192.168.28.18:~/
ssh -t ars@192.168.28.18 'cat id_rsa.pub >> ~/.ssh/authorized_keys'
```

# 2.1. Backend

## Обзор
OpenAPI-сервер обрабатывает REST-запросы, воздействует на Asterisk. WebSocket-сервер транслирует Asterisk events, дополняет их smart-данными о звонке (берет из базы абонентов).

## Установка
Мы все еще в контейнере. Директория ***node_back***
```bash
cd /asterisk-ws-react/node_back

# Проверить обновления
ncu
# обновить package.json если хочется
ncu -a

npm install
```

### Локальные правки
Если разворачиваем на **production** сервере, например **10.229.x.x**
1. Правим поле ***host*** в [node-back/api/swagger.yaml](https://github.com/ars-anosov/asterisk-ws-react/blob/master/node_back/api/swagger.yaml)
```yaml
host: '10.229.x.x:8018'
```
2. Правим ***localStorage*** параметры готового build в [index.html](https://github.com/ars-anosov/asterisk-ws-react/blob/master/node-back/build_front/index.html)
```JavaScript
    window.localStorage.setItem('specUrl',  'http://10.229.x.x:8018/spec/swagger.json')
    window.localStorage.setItem('wsUrl',    'ws://10.229.x.x:8019')
```

## Запуск
```bash
pm2 start index.js \
  --name back --watch ./controllers --restart-delay 60000 \
  -- $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT $WS_PORT $DB_HOST $DB_USER $DB_PASS
pm2 logs back

# либо без посредников, с отладкой в консоль
node index.js $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT $WS_PORT $DB_HOST $DB_USER $DB_PASS
```

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









# 2.2. Frontend

## Обзор
Компиляция JS библиотеки для браузера в директорию ***node_back/build_front***

## Установка
Мы все еще в контейнере. Директория ***web_front***
```bash
cd /asterisk-ws-react/web_front

# Проверить обновления
ncu
cd src/js/components
ncu
cd /asterisk-ws-react/web_front

# Особенности Babel читаем тут https://babeljs.io/docs/en/next/v7-migration
npx babel-upgrade

npm install
npm run install-components
```

## Запуск
Компилируем build
```bash
gulp
# production build
gulp --production
```

### Результат
Готовый build - [http://192.168.13.97:8018/build_front](http://192.168.13.97:8018/build_front)

обновляем руками: ***Ctrl+Shift+R***

---
<sub>После перехода на Babel 7 отказалась работать связка "vinyl-buffer@1.0.1"-"gulp-uglify@3.0.1" :( Временно решил с помощью "gulp-uglifyes@0.1.3", слежу за обновлениями "gulp-uglify@3.x"</sub>



## asterisk-ws-react-components
Пилим компоненты тут - [src/js/components](https://github.com/ars-anosov/asterisk-ws-react/blob/master/web-front/src/js/components)

### npm publish
Прогоняем через Babel

```bash
cd src/js/components

gulp clean
gulp
```

Публикуем на [npmjs.org](https://www.npmjs.com/package/asterisk-ws-react-component)
```bash
grep version package.json
sed -i -e 's/"version": "2.0.1"/"version": "2.0.2"/' package.json

npm login
npm publish
```