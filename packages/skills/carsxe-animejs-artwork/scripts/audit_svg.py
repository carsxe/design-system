#!/usr/bin/env python3
"""Audit an SVG intended for Anime.js draw-on animation."""

from __future__ import annotations

import argparse
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path


DRAWABLE_TAGS = {"path", "line", "polyline", "polygon", "rect", "circle", "ellipse"}


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def audit(path: Path) -> tuple[list[str], list[str], dict[str, int]]:
    errors: list[str] = []
    warnings: list[str] = []
    try:
        root = ET.parse(path).getroot()
    except (ET.ParseError, OSError) as exc:
        return [f"Cannot parse SVG: {exc}"], warnings, {}

    if local_name(root.tag) != "svg":
        errors.append("Root element is not <svg>.")
    if not root.get("viewBox"):
        errors.append("Missing viewBox; responsive scaling will be fragile.")

    elements = list(root.iter())
    ids = [el.get("id") for el in elements if el.get("id")]
    duplicates = [item for item, count in Counter(ids).items() if count > 1]
    if duplicates:
        errors.append("Duplicate IDs: " + ", ".join(sorted(duplicates)))

    title_count = sum(local_name(el.tag) == "title" for el in elements)
    desc_count = sum(local_name(el.tag) == "desc" for el in elements)
    image_count = sum(local_name(el.tag) == "image" for el in elements)
    drawable_count = sum(local_name(el.tag) in DRAWABLE_TAGS for el in elements)
    anim_counts = Counter(el.get("data-anim") for el in elements if el.get("data-anim"))

    if title_count == 0:
        warnings.append("Missing <title> accessibility text.")
    if desc_count == 0:
        warnings.append("Missing <desc> accessibility text.")
    if image_count:
        errors.append(f"Found {image_count} embedded <image> element(s); redraw meaningful raster content as vectors.")
    if drawable_count == 0:
        warnings.append("No native drawable SVG geometry found.")
    if not anim_counts:
        warnings.append("No data-anim hooks found; animation selectors may be fragile.")
    if root.get("role") != "img":
        warnings.append("Consider role=\"img\" with aria-labelledby for standalone artwork.")

    stats = {
        "elements": len(elements),
        "drawables": drawable_count,
        "animation_hooks": sum(anim_counts.values()),
        "embedded_images": image_count,
    }
    return errors, warnings, stats


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("svg", type=Path)
    args = parser.parse_args()
    errors, warnings, stats = audit(args.svg)

    for key, value in stats.items():
        print(f"{key}: {value}")
    for message in warnings:
        print(f"WARNING: {message}")
    for message in errors:
        print(f"ERROR: {message}", file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
