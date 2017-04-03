find . -type f -name '*.csv' -exec iconv --verbose -f BIG-5 -t UTF-8 {} -o {}.result \; \
-exec mv {} {}.bak \; \
-exec mv {}.result {} \;
