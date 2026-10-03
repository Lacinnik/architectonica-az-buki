#!/usr/bin/env python3
"""Rebuild md/ — readable Markdown copies of the .docx corpus. Requires: pip install mammoth."""
import glob
import re
from pathlib import Path
from urllib.parse import quote

import mammoth

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "md"


def placeholder(image):
    return {"src": "", "alt": "изображение из исходного .docx"}


def convert(path):
    with open(path, "rb") as source:
        result = mammoth.convert_to_markdown(source, convert_image=mammoth.images.img_element(placeholder))
    text = re.sub(r"\\([.()!])", r"\1", result.value)
    text = re.sub(r"(?<!^)(?<!\n)\\-", "-", text)
    text = re.sub(r"!\[([^\]]*)\]\(\)", r"*(\1)*", text)
    text = re.sub(r"(?<!!)\[([^\]]*)\]\(\)", r"\1", text)
    return f"<!-- Сгенерировано автоматически из «{path.name}». Источник истины — исходный .docx. -->\n\n{text.strip()}\n"


def main():
    OUT.mkdir(exist_ok=True)
    rows = []
    for path in sorted(ROOT.glob("*.docx")):
        (OUT / f"{path.stem}.md").write_text(convert(path), encoding="utf-8")
        rows.append(path)
    index = [
        "# Тексты корпуса в Markdown",
        "",
        "Автоматические Markdown-версии документов `.docx` из корня репозитория: их можно читать прямо на GitHub, "
        "искать по ним и видеть правки в истории. Источник истины — исходные `.docx`; после их изменения версии "
        "пересобираются командой `python3 tools/docx_to_md.py`.",
        "",
        "| Документ | Markdown |",
        "|---|---|",
    ]
    index += [f"| {path.name} | [{path.stem}.md]({quote(path.stem)}.md) |" for path in rows]
    (OUT / "README.md").write_text("\n".join(index) + "\n", encoding="utf-8")
    print(f"{len(rows)} documents converted")


if __name__ == "__main__":
    main()
