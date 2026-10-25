#!/usr/bin/env bash
# Claude Code PreToolUse hook: simple read-only shell commands run through RTK (rtk-ai/rtk, Apache-2.0 edition, built with
# --no-default-features) so their output costs fewer tokens (measured -48..-56 %). RTK is third-party code, so the rewritten
# command runs via sandbox-run.sh (no tokens in its env). Never grants permissions; any failure leaves the command unchanged.
RTK=/home/user/tools/bin/rtk
SB="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/.." && pwd)}/scripts/sandbox-run.sh"
RH=/home/user/tools/rtk-home   # fixed sandbox HOME: keeps RTK's savings log (`rtk gain`)
[ -x "$RTK" ] && command -v jq >/dev/null || exit 0
input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input" 2>/dev/null) || exit 0
# ponytail: allowlist of read-only commands, single simple commands only; widen when `rtk gain` shows it is worth it
ok='^(git (status|log|diff|show|branch)|ls|find|grep|rg)( |$)'
bad='[|;&<>`$(){}\\]'
[[ $cmd =~ $ok ]] && ! [[ $cmd =~ $bad ]] && [[ $cmd != *$'\n'* ]] || exit 0
new=$(SANDBOX_HOME=$RH "$SB" "$RTK" rewrite "$cmd" 2>/dev/null); rc=$?
[[ ($rc == 0 || $rc == 3) && $new == "rtk "* ]] || exit 0
jq -c --arg c "SANDBOX_HOME=$RH $SB $RTK ${new#rtk }" \
  '.tool_input.command = $c | {hookSpecificOutput: {hookEventName: "PreToolUse", updatedInput: .tool_input}}' <<<"$input"
