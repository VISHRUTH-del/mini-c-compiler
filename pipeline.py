"""Shared compiler pipeline helpers."""

from __future__ import annotations

from .interpreter import Interpreter
from .lexer import Lexer
from .parser import Parser, format_ast
from .semantic import SemanticAnalyzer, format_symbol_table
from .tac import TACGenerator, format_tac
from .tokens import Token


VALID_STAGES = {"output", "tokens", "ast", "symbols", "tac", "all"}


def format_tokens(tokens: list[Token]) -> str:
    return "\n".join(str(token) for token in tokens)


def run_stage(source: str, stage: str) -> str:
    """Run only the compiler work needed for one display stage."""

    if stage not in VALID_STAGES:
        raise ValueError(f"Unknown compiler stage: {stage}")

    tokens = Lexer(source).scan_tokens()
    if stage == "tokens":
        return section("TOKENS", format_tokens(tokens))

    program = Parser(tokens).parse()
    if stage == "ast":
        return section("AST", format_ast(program))

    symbols = SemanticAnalyzer().analyze(program)
    if stage == "symbols":
        return section("SYMBOL TABLE", format_symbol_table(symbols))

    instructions = TACGenerator().generate(program)
    if stage == "tac":
        return section("THREE-ADDRESS CODE", format_tac(instructions))

    if stage == "output":
        return section("PROGRAM OUTPUT", Interpreter().execute(program) or "(no output)")

    return "\n\n".join(
        [
            section("TOKENS", format_tokens(tokens)),
            section("AST", format_ast(program)),
            section("SYMBOL TABLE", format_symbol_table(symbols)),
            section("THREE-ADDRESS CODE", format_tac(instructions)),
        ]
    )


def section(title: str, body: str) -> str:
    if body:
        return f"{title}\n{'-' * len(title)}\n{body}"
    return f"{title}\n{'-' * len(title)}"
