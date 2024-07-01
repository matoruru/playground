# Argo CD

This folders are copied from [here](https://github.com/argoproj/argo-cd/tree/stable/manifests/cluster-install)

## How to create SealedSecret file

```
# Create a Secret file
echo -n <BASE64(clientSecret)> | kubectl create secret generic argocd-secret --dry-run=client --from-file=oidc.azure.clientSecret=/dev/stdin -o yaml > argocd-secret.yaml
# Create a SealedSecret from the Secret file
kubeseal --controller-namespace=sealed-secrets --controller-name=sealed-secrets -f argocd-secret.yaml -w argocd-secret.sealedsecret.yaml --scope cluster-wide
# Validate the SealedSecret
cat argocd-secret.sealedsecret.yaml | kubeseal --controller-namespace=sealed-secrets --controller-name=sealed-secrets --validate
```