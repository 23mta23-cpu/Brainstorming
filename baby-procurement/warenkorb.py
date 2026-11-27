# Warenkorb-Szenarien. V = live verifiziert, U = unverifiziert/Annahme.
# ponytail: Preise hart kodiert = Stand 27.11.2026; bei Update hier ändern.
def r(x): return round(x + 1e-9, 2)

hauck_bd = r(159.90 * 0.85)  # babyartikel Black Deal, Code blackdeal15 (Warenkorb ungetestet)

S = {
 "1 Max. Qualitaet": [
  ("Emma Kindermatratze 60x120 (Emma-Shop)", 149.25, "V"),
  ("3x Jersey-Spannbettlaken 60x120", 3*13.00, "U"),
  ("Hauck Alpha+ 4-tlg. Set Walnut/Stretch Beige, blackdeal15", hauck_bd, "V*"),
  ("Hauck Baby Seat (babyartikel)", 24.90, "V"),
  ("Hauck Alpha Click Tray (babyartikel)", 34.90, "V"),
  ("Ubbi Windeleimer (babyartikel)", 59.96, "U"),
  ("Philips Avent SCD713 (Coolblue)", 107.00, "V"),
  ("Stokke Flexi Bath Newborn Stand Bundle (Stokke DE)", 109.00, "V"),
  ("Badethermometer", 8.00, "U"),
 ],
 "2 Bestes P/L (empfohlen)": [
  ("Emma Kindermatratze 60x120, Zielpreis", 142.00, "Ziel"),
  ("2x Jersey-Spannbettlaken 60x120", 2*13.00, "U"),
  ("Hauck Alpha+ 4-tlg. Set, blackdeal15", hauck_bd, "V*"),
  ("Chicco Odour Off, Marktpreis", 36.00, "U"),
  ("Philips Avent SCD713, Zielpreis", 90.00, "Ziel"),
  ("Stokke Flexi Bath Bundle", 109.00, "V"),
  ("Badethermometer", 8.00, "U"),
 ],
 "3 Max. finanzieller Vorteil": [
  ("Emma Kindermatratze 60x120, Zielpreis", 142.00, "Ziel"),
  ("2x Jersey-Spannbettlaken 60x120", 2*13.00, "U"),
  ("Hauck Alpha+ 4-tlg. Set, blackdeal15", hauck_bd, "V*"),
  ("Chicco Odour Off Smyths Abholung Leverkusen", 10.00, "U"),
  ("Philips Avent SCD713, Zielpreis", 90.00, "Ziel"),
  ("Stokke Flexi Bath Bundle, Zielpreis", 100.00, "Ziel"),
  ("Badethermometer", 8.00, "U"),
 ],
}
# Referenz "heute regulaer ohne Aktion" fuer gleiche Kernprodukte (V-Preise bzw. Regalpreis)
REF = {"Hauck 4-tlg": 159.90, "Emma": 149.25, "SCD713": 107.00, "Stokke": 109.00}

if __name__ == "__main__":
    assert hauck_bd == 135.92, hauck_bd
    tot = {}
    for name, items in S.items():
        t = r(sum(p for _, p, _ in items)); v = r(sum(p for _, p, f in items if f.startswith("V")))
        tot[name] = t
        print(f"\n## {name}: {t:.2f} EUR  (davon live verifiziert: {v:.2f})")
        for n, p, f in items: print(f"  {p:8.2f}  [{f}]  {n}")
    assert tot["3 Max. finanzieller Vorteil"] < tot["2 Bestes P/L (empfohlen)"] < tot["1 Max. Qualitaet"]
    heute = r(hauck_bd)  # einziger sofortiger Kauf
    print(f"\nSofortkauf heute: Hauck {heute:.2f} EUR, Ersparnis ggü. Regalpreis {r(REF['Hauck 4-tlg']-heute):.2f} EUR")
    ziel = r((149.25-142) + (107-90) + (159.90-hauck_bd))
    print(f"Ersparnis Szenario 2 ggü. heutigen Regalpreisen (Emma, SCD713, Hauck): {ziel:.2f} EUR")
