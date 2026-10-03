from __future__ import annotations

from decimal import ROUND_HALF_UP, Decimal

ZERO = Decimal("0.00")
CENT = Decimal("0.01")


def calculate_totals(
    items: list[dict] | None,
    discount_percent: Decimal | None = None,
    tax_percent: Decimal | None = None,
) -> dict:
    if not items:
        return {"subtotal": ZERO, "total": ZERO, "items": []}

    computed_items = []
    subtotal = ZERO

    for item in items:
        qty = Decimal(str(item.get("quantity", 1)))
        unit_price = Decimal(str(item.get("unit_price", 0)))
        amount = (qty * unit_price).quantize(CENT, rounding=ROUND_HALF_UP)
        computed_items.append({
            "description": item.get("description", ""),
            "quantity": str(qty),
            "unit_price": str(unit_price),
            "amount": str(amount),
        })
        subtotal += amount

    discount_amount = ZERO
    if discount_percent and discount_percent > 0:
        discount_amount = (subtotal * Decimal(str(discount_percent)) / 100).quantize(
            CENT, rounding=ROUND_HALF_UP
        )

    after_discount = subtotal - discount_amount

    tax_amount = ZERO
    if tax_percent and tax_percent > 0:
        tax_amount = (after_discount * Decimal(str(tax_percent)) / 100).quantize(
            CENT, rounding=ROUND_HALF_UP
        )

    total = after_discount + tax_amount

    return {
        "subtotal": subtotal,
        "discount_amount": discount_amount,
        "tax_amount": tax_amount,
        "total": total,
        "items": computed_items,
    }
