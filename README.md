<h1 align='center'>Playground</h1>

This is a collection of my playground folder! Most of folders are **NOT** completed, being improved continuously✨ Any PRs are welcome!

色々な実験のための遊び場です！ご自由にご覧ください！プルリクエストも大歓迎です！

連絡は[matoruru - X(Twitter)](https://twitter.com/_matoruru)までお気軽にどうぞ。ご意見や質問など何でもOKです 😀

## [0001](/playgrounds/0001)

Built with [ElysiaJS](ElysiaJS) server framework on Bun.
A user can specify the time until ready (I prepared this feature for some personal testing).

ElysiaJSでサーバーを作りました。Node.jsではなくBunで動かしています。
起動までの時間を指定することができます（ちょっとした事情があり本機能を用意しました）。

## [0002](/playgrounds/0002)

Why `readinessProbe.initialDelaySeconds` is bad?
For more explanation and experimentation, please proceed to [playgrounds/0002](/playgrounds/0002) folder.

なぜ`readinessProbe.initialDelaySeconds`が良くないのでしょうか？詳しい説明や検証内容については[playgrounds/0002](/playgrounds/0002)をご覧ください。

## [0003](/playgrounds/0003)

[Kubescape](https://kubescape.io/docs/getting-started/)'s manifest scannning.

[Kubescape](https://kubescape.io/docs/getting-started/)のマニフェストスキャンを試しました。

## [0004](/playgrounds/0004)

🚧 --- Under construction --- 🚧

Redis experimentation.

Redisの実験場です。

🚧 --- Under construction --- 🚧

## [0005](/playgrounds/0005)

Kubernetes Deployment manifest for multiple Nginx pods. You can use `https://raw.githubusercontent.com/matoruru/playground/main/playground-nginx-deployment-sample/multi-nginx-pods.yaml` for `kubernetes aplly -f`.

Nginxの複数PodをデプロイするためのKubernetesマニフェストです。`https://raw.githubusercontent.com/matoruru/playground/main/playground-nginx-deployment-sample/multi-nginx-pods.yaml`のRawファイルで`kubernetes aplly -f`できます。ご自由に使ってください。

## [0006](/playgrounds/0006)

My personal Home-Kubernetes project's manifest.

私のおうちKubernetesで使っているマニフェストファイルです。使用しているツール群は上記の英語版を参照してください。

**NOTE**

This playground has been closed. Moved to [matoruru/home-kubernetes](https://github.com/matoruru/home-kubernetes).

お引越ししました。

## [0007](/playgrounds/0007)

🚧 --- Under construction --- 🚧

Chaching experimentation with [Astro](https://astro.build/), Bun and Redis.

キャッシュの実験用プロジェクトです。AstroとBunを使っています。キャッシュはRedisです。

🚧 --- Under construction --- 🚧

## [0008](/playgrounds/0008)

Ghost user (👻) is contributing in this folder (check the Git history).

幽霊に取り憑かれたフォルダです（Gitの作業履歴を見てみてください）。

**関連記事**

- [I got HAUNTED on GitHub...👻😭👻 - DEV Community](https://dev.to/matoruru/i-got-haunted-on-github-46d9) (英語, English)
- [GitHub上で心霊現象に巻き込まれました・・・。 - Qiita](https://qiita.com/matoruru/items/7a13e7677af1cd4076f3) (日本語, Japanese)

## [0009](/playgrounds/0009)

Experimentation for mounting Azure Blob Storage on k8s container without file caching. Without this way, the update from Blob Storage won't reflect into mounted directory.

Azure Blob Storageをk8sコンテナにマウントする際のキャッシュを無効にする実験をしました。この対策をしないと、Blob Storage側で更新が行われたときに反映されません。

```
# This is the important part!
mountOptions:
- --use-attr-cache=false
- --file-cache-timeout-in-seconds=0
- -o direct_io=true
```
