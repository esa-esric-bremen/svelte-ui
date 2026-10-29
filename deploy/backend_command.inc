# Operator commands (twist every 100 ms, actions): fail fast, never resend.
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_connect_timeout 2s;
proxy_send_timeout 5s;
proxy_read_timeout 5s;
# a retried command could move the robot twice
proxy_next_upstream off;
proxy_buffering off;
client_max_body_size 64k;
