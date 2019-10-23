# slides
## React + Express + webpack + nodemon
## Introduction
This is a simple web-app used for multi-users reading documents synchronously. All devices(ipads, smartphones, tablets, PCs are supported) are joined in one room, each of them can upload files(doc, ppt, pdf are supported), and other devices can read at the same pace. For example, device A moves the currently displayed document from page 1 to page 2, and the document displayed on other devices is also turned to page 2.
## Components
1. Frontend: react-bootstrap
2. Document display: react-pdf, office-to-pdf(using soffice of libreoffice)
3. Synchronized page turning: socket-io
## Start up:
```npm install```

```nodemon --config```

then open [http://localhost:8080/](http://localhost:8080/) in your browser
