# Argo CD

This folders are copied from [here](https://github.com/argoproj/argo-cd/tree/stable/manifests/cluster-install)

## How to create SealedSecret file

```
# Create a Secret file
echo -n <BASE64(clientSecret)> | kubectl create secret generic argocd-secret --dry-run=client --from-file=oidc.azure.clientSecret=/dev/stdin -o yaml > azure-sso.secret.yaml
# Create a SealedSecret from the Secret file
kubeseal --controller-namespace=sealed-secrets --controller-name=sealed-secrets -f azure-sso.secret.yaml -w azure-sso.sealedsecret.yaml --scope cluster-wide
# Validate the SealedSecret
cat azure-sso.sealedsecret.yaml | kubeseal --controller-namespace=sealed-secrets --controller-name=sealed-secrets --validate
```