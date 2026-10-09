from decimal import Decimal

from app.services.pricing import calculate_totals


def test_empty_items():
    result = calculate_totals(None)
    assert result["subtotal"] == Decimal("0.00")
    assert result["total"] == Decimal("0.00")
    assert result["items"] == []


def test_single_item():
    items = [{"description": "Design", "quantity": 1, "unit_price": 5000}]
    result = calculate_totals(items)
    assert result["subtotal"] == Decimal("5000.00")
    assert result["total"] == Decimal("5000.00")
    assert len(result["items"]) == 1
    assert result["items"][0]["amount"] == "5000.00"


def test_multiple_items():
    items = [
        {"description": "Design", "quantity": 2, "unit_price": 1000},
        {"description": "Dev", "quantity": 10, "unit_price": 150},
    ]
    result = calculate_totals(items)
    assert result["subtotal"] == Decimal("3500.00")
    assert result["total"] == Decimal("3500.00")


def test_discount():
    items = [{"description": "Work", "quantity": 1, "unit_price": 10000}]
    result = calculate_totals(items, discount_percent=Decimal("10"))
    assert result["subtotal"] == Decimal("10000.00")
    assert result["discount_amount"] == Decimal("1000.00")
    assert result["total"] == Decimal("9000.00")


def test_tax():
    items = [{"description": "Work", "quantity": 1, "unit_price": 10000}]
    result = calculate_totals(items, tax_percent=Decimal("8"))
    assert result["subtotal"] == Decimal("10000.00")
    assert result["tax_amount"] == Decimal("800.00")
    assert result["total"] == Decimal("10800.00")


def test_discount_and_tax():
    items = [{"description": "Work", "quantity": 1, "unit_price": 10000}]
    result = calculate_totals(items, discount_percent=Decimal("10"), tax_percent=Decimal("8"))
    assert result["subtotal"] == Decimal("10000.00")
    assert result["discount_amount"] == Decimal("1000.00")
    assert result["tax_amount"] == Decimal("720.00")
    assert result["total"] == Decimal("9720.00")


def test_zero_quantity():
    items = [{"description": "Zero", "quantity": 0, "unit_price": 100}]
    result = calculate_totals(items)
    assert result["subtotal"] == Decimal("0.00")


def test_rounding():
    items = [{"description": "Fractional", "quantity": 3, "unit_price": "33.33"}]
    result = calculate_totals(items)
    assert result["subtotal"] == Decimal("99.99")
