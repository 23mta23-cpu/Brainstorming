"""TCO Windeleimer 1/2/3 Jahre. Alle Eingaben = ANNAHME oder Preis-Snippet (siehe C-windeleimer.md)."""
# (Tage, Windeln/Tag) je Lebensphase
PHASES = [(91, 9), (274, 6.5), (365, 5), (365, 4)]  # 0-3M, 3-12M, 1-2J, 2-3J
def diapers(days):
    n, left = 0.0, days
    for d, r in PHASES:
        t = min(left, d); n += t * r; left -= t
    return n
def empties(days, cap, max_interval=3):
    """Leerungen: Eimer voll (cap) oder spaetestens alle max_interval Tage."""
    n, left, total = 0.0, days, 0.0
    t = 0
    for d, r in PHASES:
        seg = min(left, d); left -= seg
        total += seg / min(cap / r, max_interval)
    return total
BAG = 0.05  # EUR/Standard-Muellbeutel 20-30 l, ANNAHME
# name: (Eimerpreis, cap Windeln, Typ, Kosten/Kassette, Windeln/Kassette real)
M = {
 "Chicco Odour Off (10 EUR Smyths, unverif.)": (13.95, 25, "bag", 0, 0),
 "Chicco Odour Off (Markt ~43 EUR)":           (43+4, 25, "bag", 0, 0),
 "Ubbi Stahl (~60 EUR, Std-Beutel)":           (60+4, 25, "bag", 0, 0),
 "Rotho Bella Bambina (~13 EUR, Std-Beutel)":  (13+4, 10, "bag", 0, 0),
 "Tommee Tippee Twist&Click (Kassette 7.49)":  (30, 30, "cass", 7.49, 100),
 "Angelcare Classic XL (Kassette 7.80)":       (20, 57, "cass", 7.80, 120),
}
def tco(name, years):
    price, cap, typ, ck, per = M[name]; days = 365 * years
    if typ == "bag": run = empties(days, cap) * BAG
    else: run = diapers(days) / per * ck
    return price + run
if __name__ == "__main__":
    assert round(diapers(365)) == round(91*9 + 274*6.5)
    assert diapers(1095) > diapers(730) > diapers(365)
    assert empties(365, 25) >= 365/3          # min. alle 3 Tage
    assert tco("Chicco Odour Off (Markt ~43 EUR)", 3) < tco("Tommee Tippee Twist&Click (Kassette 7.49)", 3)
    print(f"Windeln: 1J {diapers(365):.0f}, 2J {diapers(730):.0f}, 3J {diapers(1095):.0f}")
    print(f"{'Modell':46}{'1J':>8}{'2J':>8}{'3J':>8}")
    for n in M: print(f"{n:46}" + "".join(f"{tco(n,y):8.1f}" for y in (1,2,3)))
    print("Leerungen Chicco 3J:", round(empties(1095,25)), "Beutel-Kosten", round(empties(1095,25)*BAG,1), "EUR")
    print("OK")
