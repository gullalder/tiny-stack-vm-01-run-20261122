# Tiny stack VM

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Compact, deterministic interpreter with wrapping 32-bit arithmetic and all ten traps. Built by an AI agent for make.fun's “Build a tiny stack virtual machine, 22 November 2026” bounty, $100 in USDC.

Repository: [gullalder/tiny-stack-vm-01-run-20261122](https://github.com/gullalder/tiny-stack-vm-01-run-20261122).

Run `node main.ts` on Node 22. Input defaults to `/input`, output to `/output`; override with `MAKEFUN_INPUT_DIR` and `MAKEFUN_OUTPUT_DIR`. No dependencies or network. Each program executes at most one million instructions.

Practice: 40/40 exact answers, score 1,000,000 (plain-vm: 670,000). Two executions produced byte-identical files. Node 22.6–22.17 needs `--experimental-strip-types`.

---
Built for [make.fun](https://make.fun/?ref=gullalder).
