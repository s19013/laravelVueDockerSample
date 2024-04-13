# 
`composer create-project "laravel/laravel=10.*" backend`  

laravel11では私に色々不都合があったため10を指定する  

# docker compose uoのコマンド
`docker compose --env-file ./backend/src/.env up -d`  
.envファイルにAppkeyを生成する必要があるのでlaravelディレクトリから動かしては行けないと思うのでコマンドから.envファイルを指定する  

# flashMessage
laravelの画面遷移時のフラッシュメッセージのような機能を実装しようとしたが｡  
vue Routerの大きな仕様変更により実装が難しくなったため断念｡  

# 使ってるライブラリ
[axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)

自分が使っているaxiosはカスタマイズしたやつなのでネットに乗ってる方法でやるのは難しいもよう｡  
このライブラリを使ってカスタマイズしたaxiosをモックしている

# 参考サイト
## javascript
* [指定の文字より前/後ろ](https://if.t0m0t.com/post-220/)

## laravel
[Docker+Nginx+MySQLでLaravelの開発環境構築](https://entreprogrammer.jp/laravel-nginx-docker/)

## vitest
* [Vue/Jestテストのハマりどころ３選!!](https://tech-blog.rakus.co.jp/entry/20200206/vue-js/jest/software-test)
* [Next/RouterのMock - Vitest](https://zenn.dev/renoa/articles/vitest-next-router-mock)
* [Nuxt3でのVue Test Utilsでのvmがの中身が{}（空）の件](https://zenn.dev/tmo_taka/articles/91e040c081046a)
* [expect](https://vitest.dev/api/expect)
* [Vitest と呼ばれるテスティングフレームワークがめちゃくちゃ早いらしいな](https://azukiazusa.dev/blog/testingframework-vitest/)

## vue test utils
* [Using-a-Real-Router](https://test-utils.vuejs.org/guide/advanced/vue-router#Using-a-Real-Router)
* [wrapper](https://v1.test-utils.vuejs.org/ja/api/wrapper/)
* [API Reference](https://test-utils.vuejs.org/api/)
* [Asynchronous Behavior](https://test-utils.vuejs.org/guide/advanced/async-suspense.html)
* [wrapper v1](https://v1.test-utils.vuejs.org/ja/api/wrapper/)
* [Vitestのテストで使えるマッチャー一覧](https://qiita.com/mori_goq/items/f9dfe1875befe1e6283b)
* [api v1](https://v1.test-utils.vuejs.org/ja/api/)
* [API Reference](https://test-utils.vuejs.org/api/)
* [Testing Vue Router](https://test-utils.vuejs.org/guide/advanced/vue-router.html)
* [Making HTTP requests](https://test-utils.vuejs.org/guide/advanced/http-requests.html)
* [Asynchronous Behavior](https://test-utils.vuejs.org/guide/advanced/async-suspense.html)