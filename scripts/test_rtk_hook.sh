#!/usr/bin/env bash
# Self-check for rtk-hook.sh: rewrites only simple read-only commands, leaves everything else untouched.
cd "$(dirname "$0")/.."; fail=0
check() { out=$(jq -cn --arg c "$2" '{tool_name:"Bash",tool_input:{command:$c}}' | CLAUDE_PROJECT_DIR=$PWD scripts/rtk-hook.sh)
  if [[ ($1 == yes && $out == *"bin/rtk "*) || ($1 == no && -z $out) ]]; then echo "ok   $1  $2"; else echo "FAIL $1  $2 -> $out"; fail=1; fi; }
[ -x /home/user/tools/bin/rtk ] || { echo "skip: rtk not built (scripts/setup_tools.sh)"; exit 0; }
check yes "git status"; check yes "ls -la pipeline"; check yes "find . -name '*.py'"
check no "cd x && git status"; check no "git push origin main"; check no 'grep -rn foo $HOME'
check no "python3 pipeline/build.py"; check no $'ls\nrm -rf /'; check no "ls | head"
exit $fail
