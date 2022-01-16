const https = require('https');
const http = require('http');

const { pipeline } = require('stream');

const submit_to_proxy = function (req, res, dest_url) {
    //req.url = dest_url
    const dest_url_parsed = new URL(dest_url);
    const req_options = {
        rejectUnauthorized: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        }
    };

    const handler = dest_url_parsed.protocol === 'https:' ? https : http;
    const request = handler.request(dest_url_parsed, req_options, response => {
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);

        pipeline(
            response,
            res,
            err => {
                if (err)
                    console.error('Pipeline failed.', err);
                else
                    console.log('Pipeline succeeded.');
            }
        );
        
        // res.on('data', (d) => {
        //   process.stdout.write(d);
        // });
    });

    request.on('error', error => {
        console.error(error)
    });

    request.end();
    console.log(dest_url_parsed);
};

const server = http.createServer(function (req, res) {
    const url = "https://trailers.czechvr.com/czechvr/videos/download/468/468-czechvr-3d-7680x3840-60fps-oculusrift_uhq_h265-fullvideo-1.mp4";
    submit_to_proxy(req, res, url);
});
  
server.listen(3000);

// submit_to_proxy(1,2, "https://img2.badoink.com/content/scenes/325522/a-roll-in-the-hay-325522.jpg");
// submit_to_proxy(1,2, "https://www.czechvr.com/category/1816-a-sweet-surprise-468-cvr/468-czechvr-big.jpg");
// submit_to_proxy(1,2, "https://httpbin.org/get");
// submit_to_proxy(1,2, "http://httpbin.org/get");
// submit_to_proxy(1,2, "https://self-signed.badssl.com/");

/**
 * TODO:
 * - Streamify https://stackoverflow.com/a/46146154 mayber Pipeline? https://stackoverflow.com/q/58875655
 * - Headers: https://nodejs.org/api/http.html#responsewriteheadstatuscode-statusmessage-headers
 * - Passthrough Content Type Headers
 * - Passthrough Content-Length
 * - Passthrough Range request headers -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
 *     -> Response Code 206 -> also pass other response codes?
 * - Passthrough gunzip encoding stuff? maybe not? src: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
 */