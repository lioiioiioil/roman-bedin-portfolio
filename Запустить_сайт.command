#!/bin/zsh
set -eu
cd -- "${0:A:h}"
echo "Сайт: http://127.0.0.1:5173"
echo "Для остановки нажмите Ctrl+C."
python3 -m http.server 5173 --bind 127.0.0.1
