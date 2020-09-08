Проектная работа 15 - Api для проекта Mesto (Mongo, REST, nginx) v.1.0.0
=============================
Цель данного проекта - создание сервера с API, аутентификацией и авторизацией для проекта МЕСТО. Научиться работать с базами данных, разобраться в безопасности и тестировании, научиться разворачивать бекенд на удаленной машине.

## Ссылки на проект
https://mesto-project.ml
http://mesto-project.ml
84.201.150.134 - публичный IP

## Технологический стек
- JS
- Фреймворк express
- используется editorconfig, eslint, jsonwebtoken, bcryptjs, validator, pm2 
- MongoDB
- REST
- nginx
- шифрование https

## версия 1.0.0
- POST/signup - создается пользователь, для отправки обязательные поля: name, about, avatar, email, password 
- POST/signin - авторизация пользователя, для авторизации необходимо ввести email, password
- GET /users - выводится JSON список пользователей 
- GET /users/id - выводится JSON объек конктретного юзера, если юзер не найден выводится ошибкаи
- GET /cards - выводится JSON список всех карточек 
- POST /cards - создается карточка, для отправки обязательные поля: name, link
- DELETE/cards/id - удаление собственных карточек, пользователь не может удалить чужую карточку
- PUT /cards/id/likes - проставляется Like у карточки
- DELETE /cards/id/likes - удаляется Like у карточки
- Ошибки обрабатываются централизовано
- Производится сбор Логов (запросы и ошибки)
- Происходит валидация приходящих данных на сервер
 
## Инструкция как развернуть проект
- Клонировать репозиторий: https://github.com/vitekv384/mesto_project.git
- Установить node.js
- Установить необходимые пакеты командой: npm i
- Запустить сервер командой: npm run dev
