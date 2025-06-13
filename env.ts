const url = "http://127.0.0.1:9000"
const cert = "C:\\Users\\Xiaohuang\\AppData\\Roaming\\Reqable\\certificate\\reqable-root.crt"

const env = {
    GLOBAL_AGENT_HTTP_PROXY: url,
    https_proxy: url,
    http_proxy: url,
    HTTPS_PROXY: url,
    HTTP_PROXY: url,
    REQUESTS_CA_BUNDLE: cert,
    NODE_EXTRA_CA_CERTS: cert,
    CURL_CA_BUNDLE: cert,
    SSL_CERT_FILE: cert,
    PERL_LWP_SSL_CA_FILE: cert,
    RUBYLIB: "C:\\Users\\Xiaohuang\\.reqable\\overrides\\ruby"
}

console.log(
    Array.from(Object.entries(env))
    .map(([key, value]) => `$env:${key} = "${value}"`)
    .join(";")
)

// bun .\env.ts | Invoke-Expression