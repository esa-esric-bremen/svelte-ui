# Telemetry websocket: long lived, unbuffered.
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_connect_timeout 2s;
# the relay sends at least every 500 ms, a connection silent this long is dead
# and the browser reconnects
proxy_read_timeout 30s;
proxy_send_timeout 30s;
proxy_buffering off;
