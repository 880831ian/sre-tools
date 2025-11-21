#!/usr/bin/env bash
set -euo pipefail

URL="https://raw.githubusercontent.com/awslabs/amazon-eks-ami/main/nodeadm/internal/kubelet/instance-info.jsonl"
TMP="$(mktemp)"

curl -sS "$URL" -o "$TMP"

echo "export const eksinstancetypes = [" > eksInstanceTypes.js

while IFS= read -r line; do
  instanceType=$(echo "$line" | jq -r '.instanceType')
  MaxENI=$(echo "$line" | jq -r '.defaultMaxENIs')
  IPv4addr=$(echo "$line" | jq -r '.ipv4AddressesPerInterface')
  maxPods=$(( MaxENI * (IPv4addr - 1) + 2 ))
  family=$(echo "$instanceType" | cut -d'.' -f1 | tr '[:lower:]' '[:upper:]')

  printf "  {\n" >> eksInstanceTypes.js
  printf "    \"type\": \"%s\",\n" "$instanceType" >> eksInstanceTypes.js
  printf "    \"maxpods\": %s,\n" "$maxPods" >> eksInstanceTypes.js
  printf "    \"ipv4addr\": %s,\n" "$IPv4addr" >> eksInstanceTypes.js
  printf "    \"maxeni\": %s,\n" "$MaxENI" >> eksInstanceTypes.js
  printf "    \"family\": \"%s\"\n" "$family" >> eksInstanceTypes.js
  printf "  },\n" >> eksInstanceTypes.js

done < "$TMP"

echo "]" >> eksInstanceTypes.js
