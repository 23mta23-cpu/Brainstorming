#!/usr/bin/env bash
# Re-clone the 17 evaluated repositories at the exact audited commits (untrusted data: never run code from them outside scripts/sandbox-run.sh).
set -euo pipefail; V="${1:-/home/user/vendor}"; mkdir -p "$V"
while read -r name url sha; do
  [ -d "$V/$name/.git" ] && continue
  git init -q "$V/$name" && git -C "$V/$name" fetch -q --depth 1 "$url" "$sha" && git -C "$V/$name" checkout -q FETCH_HEAD
  echo "$name @ ${sha:0:12}"
done <<EOF
Claude-Code-Video-Toolkit https://github.com/wilwaldon/Claude-Code-Video-Toolkit.git a6e9e5225d85585472666598297f47d9584f9a97
ECC https://github.com/affaan-m/ECC.git 90606c8315ee09cafc303515c5f33024db6b9882
OpenMontage https://github.com/calesthio/OpenMontage.git e01dbf433f46eeb91d39bf905e194162921019a3
SkillSpector https://github.com/NVIDIA/SkillSpector.git d7338f58200a9ae2a24810cee08911ab68b107a7
VoiceStudio https://github.com/debpalash/VoiceStudio.git 3e4903096dec1f075c8b22bde1177e14df7a72bf
artcraft https://github.com/storytold/artcraft.git 1f969a9224934a55417daf10359a6fb1458b63f4
awesome-opus5-5-videos https://github.com/yihui-dev/awesome-opus5-5-videos.git 92aee2f586ac0715cb3cbcb6384834f98a33383d
claude-mem https://github.com/thedotmack/claude-mem.git a4469fd4fc036461c05257184fe6445755f8e370
deer-flow https://github.com/bytedance/deer-flow.git 2b6716c920e1ef0bc9bf28c852d87321af74313e
graphify https://github.com/Graphify-Labs/graphify.git 92741d162b2094ffc2fed58cfbd8ee823e9da62c
headroom https://github.com/headroomlabs-ai/headroom.git 3fef15d376d9899f77a28464e2e91f8b99514930
omniroute https://github.com/ChrisCompton/omniroute.git 515674b6cf7cc29b3db027c9119e9b2ef12e0ba7
one-skill-to-rule-them-all https://github.com/rebelytics/one-skill-to-rule-them-all.git ac00bed07526475a6679a3dc018e145f5e0a672f
ponytail https://github.com/DietrichGebert/ponytail.git 09c434ab73ca43761c5d8b0c5d341926c2fba710
rtk https://github.com/rtk-ai/rtk.git 32b2ec4386d90f27255ec984ea7b45ba42bf4694
superpowers https://github.com/obra/superpowers.git 2ce8aa15d05bd57213e6f746f953aafb7ded7a8b
youtube-agent-skill https://github.com/Jakeschincariol/youtube-agent-skill.git a2feb2104981a375ffd4f87ee04f4f5344ac43c6
EOF
