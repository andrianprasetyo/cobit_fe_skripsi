# Assessment Cobit APP

![Logo Cobit APP](https://www.itcolombia.com/wp-content/uploads/2022/08/COBIT-F.png "Logo Cobit APP")                          

## Branch

Branch untuk mode pengembangan :

| Branch                          | Description                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `dev`                   | Branch untuk mode pengembangan  (`development`)                                                 |
| `main`                   | Branch untuk mode publikasi  (`production`)                                                                           |

## Instalasi

Assessment Cobit APP membutuhkan [Node.js](https://nodejs.org/) v14+ untuk menjalakan aplikasi.

Install `dependencies` dan `devDependencies`

``` bash
# install dependencies
npm install
```

## Running Project

Mode Pengembangan `(Development)`
``` bash
# menjalankan aplikasi mode pengembangan (development)
npm run dev
```

Mode Publikasi `(Production)`
```sh
# build project
npm run build

# menjalankan hasil build untuk dipublikasi (production)
npm run preview
```

## Environment

```sh
# env untuk mode pengembangan `(development)`
.env.DEV

# env untuk mode publikasi (production)
.env.PROD
```

## Port 

 Untuk Mode Pengembangan `(Development)`
- Running di port `8010` bisa dicek di file `vite.config.js` :
```json
{
    server: {
        port: 8010
    }
}
```
 Untuk Mode Publikasi `(Production)`
- Running di port `8020` bisa dicek di file `vite.config.js` :
```json
{
    preview: {
        port: 8020
    }
}
```

