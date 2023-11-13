# botMaalsi
Bot discord qui poste les cours de la journée

# Install
```bash
npm install
```

# Usage
## preferredNodeVersion
#### version

- `node`: v20.5.0
- `nodejs`: v12.22.12
- `npm`: 9.8.0

## Process manager
J'ai pas dockerisé le bot, du coup j'utilise [pm2](https://pm2.keymetrics.io/)

### Pm2
```bash
pm2 start src/index.js --name botMaalsi 
```