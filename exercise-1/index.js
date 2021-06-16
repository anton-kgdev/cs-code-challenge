const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(process.env.NODE_ENV);

    /** Initialize index.html loading */
    if ((req.url === '/') && (process.env.NODE_ENV !== 'test')) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        fs.createReadStream('./index.html').pipe(res);
    }

    /** Initialize test.html loading */
    if ((req.url === '/') && (process.env.NODE_ENV === 'test')) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        fs.createReadStream('./test.html').pipe(res);
    }

    /** For loading local STATIC files we will use next case */
    if (req.url.endsWith('.js') || req.url.endsWith('.css')) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
        });

        fs.createReadStream('./' + req.url).pipe(res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
