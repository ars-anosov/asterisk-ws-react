# asterisk-ws-react

# 1. Back (контейнер node)

## Окружение
Работал в следующем окружении:
<AMI-host> <AMI-port> <AMI-user> <AMI-secret> <OpenAPI-port>
- **asterisk-ws-react** - Docker-контейнер NodeJS v.10
- **AMI_HOST** - Asterisk IP
- **AMI_PORT** - Asterisk AMI Port
- **AMI_USER** - Asterisk AMI User
- **AMI_SECRET** - Asterisk AMI Secret
- **OPENAPI_PORT=8018** - http порт на Pruduction машине для OpenAPI запросов к сервису

Правим поле ***host*** в [node-back/api/swagger.yaml](https://gitlab.com/ars.anosov/asterisk-ws-react/blob/master/node_back/api/swagger.yaml)
```yaml
host: 'INSERT_PUBLIC_IP_HERE:8018'
```

## Docker
Директория ***node_back***
```bash
cd node_back

sudo docker run \
  --name asterisk-ws-reactor \
  -v $PWD:/asterisk-ws-reactor \
  -w /asterisk-ws-reactor \
  -e "AMI_HOST=192.168.30.29" -e "AMI_PORT=5038" -e "AMI_USER=helpdesk" -e "AMI_SECRET=helpdeskadmin" \
  -e "OPENAPI_PORT=8018" \
  -p 8018:8018 \
  -it \
  node:10 bash
```

## Серивс
Стартуем
```bash
npm install

# с отладкой в консоль
node index.js $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT

# либо через pm2 в Production
pm2 start index.js \
  --name aster_ws --watch ./controllers --restart-delay 60000 \
  -- $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT
# логи тут
pm2 logs aster_ws
```

OpenAPI (Swagger):
- WEB-интерфейс для тестовых запросов через **Swagger-UI** - [INSERT_PUBLIC_IP_HERE:8018/spec-ui/](http://INSERT_PUBLIC_IP_HERE:8018/spec-ui/)
- **OpenAPI-Spec** файл доступен - [INSERT_PUBLIC_IP_HERE:8018/spec/swagger.json](http://INSERT_PUBLIC_IP_HERE:8018/spec/swagger.json)
- **API** принимает REST-запросы - [INSERT_PUBLIC_IP_HERE:8018/v2api](http://INSERT_PUBLIC_IP_HERE:8018/v2api/)