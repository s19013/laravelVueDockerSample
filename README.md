# 
`composer create-project "laravel/laravel=10.*" backend`  

laravel11では私に色々不都合があったため10を指定する  

# docker compose uoのコマンド
`docker compose --env-file ./backend/src/.env up -d`  
.envファイルにAppkeyを生成する必要があるのでlaravelディレクトリから動かしては行けないと思うのでコマンドから.envファイルを指定する  

# 参考サイト

## laravel
[Docker+Nginx+MySQLでLaravelの開発環境構築](https://entreprogrammer.jp/laravel-nginx-docker/)