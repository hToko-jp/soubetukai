# GitHub Actionsでの自動デプロイ設定手順

GitHub Actionsを使って、`main` (または `master`) ブランチにプッシュされたタイミングで、自動的にFirebase Hostingへデプロイするための設定手順です。

## 1. Firebase サービスアカウントのキーを取得する

GitHub Actionsがあなたの代わりにFirebaseにデプロイできるように、サービスアカウントのキー（権限証）が必要です。

1. [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts?project=chat-app-50f39) にアクセスします（プロジェクト: `chat-app-50f39`）。
2. プロジェクトが選択されていることを確認します。
3. **「サービス アカウントを作成」** をクリックします。
    - **サービス アカウント名**: `github-action-deploy` （など分かりやすい名前）
    - **完了** をクリックして作成します。
4. 作成されたサービスアカウントの行の「操作（縦の3点リーダー）」をクリックし、**「鍵を管理」** を選択します。
5. **「鍵を追加」** > **「新しい鍵を作成」** をクリックします。
6. キーのタイプで **「JSON」** を選択し、**「作成」** をクリックします。
7. JSONファイルがパソコンにダウンロードされます。このファイルの中身を後で使います。

> **注意**: すでに `firebase-adminsdk` などのサービスアカウントがある場合は、それを使って鍵を作成しても構いません。
> **重要**: サービスアカウントには「Firebase Hosting 管理者」などの適切な権限が必要です。もしデプロイに失敗する場合は、IAM管理画面でそのサービスアカウントに `Firebase Hosting Admin` ロールを付与してください。
> もっと簡単な方法として、次のコマンドをローカルPCのターミナルで実行することでもキーを生成・設定できます（Firebase CLIが必要です）:
> `firebase init hosting:github`

## 2. GitHub リポジトリに Secrets を登録する

取得したキー（JSONファイルの中身）をGitHubに登録します。

1. このプロジェクトの GitHub リポジトリを開きます。
2. **「Settings」** (設定) タブをクリックします。
3. 左サイドメニューの **「Secrets and variables」** > **「Actions」** をクリックします。
4. **「New repository secret」** (新しいリポジトリシークレット) ボタンをクリックします。
5. **Name** (名前) に以下を入力します（正確に入力してください）:
   `FIREBASE_SERVICE_ACCOUNT_CHAT_APP_50F39`
6. **Secret** (値) に、先ほどダウンロードした **JSONファイルの中身をすべてコピー＆ペースト** します。
7. **「Add secret」** をクリックして保存します。

## 3. デプロイの確認

1. この変更（`.github/workflows/deploy.yml` や `firebase.json` など）を GitHub にコミット＆プッシュします。
2. GitHub リポジトリの **「Actions」** タブを開きます。
3. ワークフローが実行されているのが確認できるはずです。緑色のチェックマークが付けばデプロイ完了です。

## ファイル構成について
- `.github/workflows/deploy.yml`: 自動デプロイの指示書です。
- `firebase.json`: どのファイルを公開するかの設定ファイルです。今回はビルド不要なのでカレントディレクトリ全体を指定していますが、無視するファイル（`ignore`）を設定しています。
- `.firebaserc`: プロジェクトIDの設定ファイルです。
