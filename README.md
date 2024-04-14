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
* [JavaScriptで特定の文字列が含まれているか調べるメソッドの使い方](https://qiita.com/shimajiri/items/a2d79d9aa1323da972f3)
* [指定の文字より前/後ろ](https://if.t0m0t.com/post-220/)
* [JavaScript 正規表現まとめ](https://qiita.com/iLLviA/items/b6bf680cd2408edd050f)
* [jsでのプロパティの存在チェック方法をまとめてみる](https://qiita.com/rymiyamoto/items/be91b04f70de2b621bb3)
* [RegExp.prototype.test()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)
* [JSON.stringify()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

## laravel
[Docker+Nginx+MySQLでLaravelの開発環境構築](https://entreprogrammer.jp/laravel-nginx-docker/)

## vitest
* [Jestでデフォルト値設定済みのaxiosインスタンスに対するMockテスト](https://qiita.com/clomie/items/ccf8977a7724f81eff12)
* [Nuxt3でのVue Test Utilsでのvmがの中身が{}（空）の件](https://zenn.dev/tmo_taka/articles/91e040c081046a)
* [コードで理解。jest.mock()、jest.spyOn()、jest.fn()の違い。](https://qiita.com/TMDM/items/bc6940fc2ed4a67fe4ff)
* [Next/RouterのMock - Vitest](https://zenn.dev/renoa/articles/vitest-next-router-mock)
* [【備忘録】JestのspyOn()とmock()の使い方について](https://qiita.com/m-yo-biz/items/e9b6298d111ff6d03a5e)
* [【Jest】モック関数入門](https://zenn.dev/aidemy/articles/62720a7cab9115)
* [Vitestでaxiosをモックする方法（mock, spyOn）](https://qiita.com/mori_goq/items/a99f75ce29098a59df60)
* [JestによるAxiosモック化方法の覚え書き](https://qiita.com/t-kubodera/items/f1b0029e4e98f99656b9)
* [Jestオブジェクト](https://jestjs.io/ja/docs/jest-object)
* [わかる！Jest モック](https://zenn.dev/sekitats/articles/b586e897baa8c7)
* [React(Jest)でAxiosをMockしてPOSTのテストを行う](https://qiita.com/Sicut_study/items/e79762f0147cb36701a1)
* [Vue/Jestテストのハマりどころ３選!!](https://tech-blog.rakus.co.jp/entry/20200206/vue-js/jest/software-test)
* [Next/RouterのMock - Vitest](https://zenn.dev/renoa/articles/vitest-next-router-mock)
* [Nuxt3でのVue Test Utilsでのvmがの中身が{}（空）の件](https://zenn.dev/tmo_taka/articles/91e040c081046a)
* [Vitest と呼ばれるテスティングフレームワークがめちゃくちゃ早いらしいな](https://azukiazusa.dev/blog/testingframework-vitest/)
* [expect](https://vitest.dev/api/expect)
* [vi](https://vitest.dev/api/vi)
* [mock functions](https://vitest.dev/api/mock)
* [モック関数](https://jestjs.io/ja/docs/next/mock-functions)


## vue test utils
* [Vue Test UtilsでStub, Mock, Shallow Mountを理解する](https://reffect.co.jp/vue/vue-mock-axios)
* [Vitestのテストで使えるマッチャー一覧](https://qiita.com/mori_goq/items/f9dfe1875befe1e6283b)
* [Using-a-Real-Router](https://test-utils.vuejs.org/guide/advanced/vue-router#Using-a-Real-Router)
* [wrapper](https://v1.test-utils.vuejs.org/ja/api/wrapper/)
* [API Reference](https://test-utils.vuejs.org/api/)
* [Asynchronous Behavior](https://test-utils.vuejs.org/guide/advanced/async-suspense.html)
* [wrapper v1](https://v1.test-utils.vuejs.org/ja/api/wrapper/)
* [api v1](https://v1.test-utils.vuejs.org/ja/api/)
* [API Reference](https://test-utils.vuejs.org/api/)
* [Testing Vue Router](https://test-utils.vuejs.org/guide/advanced/vue-router.html)
* [Making HTTP requests](https://test-utils.vuejs.org/guide/advanced/http-requests.html)
* [Asynchronous Behavior](https://test-utils.vuejs.org/guide/advanced/async-suspense.html)

## playwright
* [playwright（Node.js） で E2E テスト！](https://zenn.dev/ryoka419319/articles/428ecee482a8ea)
* [Playwright の前処理と後処理](https://zenn.dev/jyoppomu/articles/bc1a96a3656a59)
* [Playwrightで秒数指定wait処理を避けてスマートにする](https://engineering.meetsmore.com/entry/2023/12/15/210122)
* [Playwrightのインストール方法と使い方](https://future-architect.github.io/articles/20230822a/)
* [playwrightでAxios通信時のデータをテストする](https://mozyanari.com/2024/02/19/playwright_axios_test/)
* [完全に理解できる！Playwrightことはじめ](https://zenn.dev/012xx/articles/c3839d1f631829)
* [Playwright早く知っておきたかった機能集](https://zenn.dev/emmatester/scraps/1f82310dd08164)
* [PlaywrightでカスタムURLスキームへの遷移をテストする](https://developers.bookwalker.jp/entry/2023/11/27/135732)
* [Playwrightチートシート](https://qiita.com/rokumura7/items/c82f205db5310c922bbd)
* [API Mocking for your Playwright tests](https://dev.to/playwright/api-mocking-for-your-playwright-tests-47ah)
* [How to Use Mock API in Playwright](https://hackernoon.com/how-to-use-mock-api-in-playwright)
* [PlaywrightによるHTML要素の指定](https://web.biz-prog.net/playwright/locators.html)
* [Playwright + VueをDockerで実行する](https://zenn.dev/kurokimaru/articles/0b15fb3caab925)
* [PlayWrightのすゝめ](https://note.com/shift_tech/n/nb86761c14c9e)
* [これだけはおさえておきたいPlaywrightコマンド集](https://qiita.com/oh_rusty_nail/items/d955e3273994214a0afa)
* [【Playwright 入門】Playwrightで始めるE2Eテスト](https://tech-blog.rakus.co.jp/entry/20230509/playwright)
* [PlaywrightでAPIをモックする 〜PokéAPIでヌオーさんを優勝させる〜](https://zenn.dev/hosaka313/articles/6c825335b288c4)
* [PlaywrightでHTTPリクエストをモック](https://qiita.com/juge2mu/items/19918723b19af0a5eb41)
* [Playwright Test](https://playwright.dev/docs/api/class-test)
* [Mock APIs](https://playwright.dev/docs/mock)
* [Network](https://playwright.dev/docs/network)
* [Locator](https://playwright.dev/docs/api/class-locator)
* [Other locators](https://playwright.dev/docs/other-locators)
* [Page](https://playwright.dev/docs/api/class-page)
* [LocatorAssertions](https://playwright.dev/docs/api/class-locatorassertions)
* [GenericAssertions](https://playwright.dev/docs/api/class-genericassertions)
* [APIResponse](https://playwright.dev/docs/api/class-apiresponse)
* [BrowserContext](https://playwright.dev/docs/api/class-browsercontext)
* [Request](https://playwright.dev/docs/api/class-request)
* [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext)
* [Route](https://playwright.dev/docs/api/class-route)
* [Input](https://www.cuketest.com/playwright/docs/input/)