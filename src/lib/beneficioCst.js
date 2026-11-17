import table from "../data/beneficioCst.json";

export { table as benefitTable };

export function findBenefits(cst, query = "") {
  const normalizedCst = String(cst).trim().padStart(2, "0");
  const term = query.trim().toLocaleLowerCase("pt-BR");
  return table.rows.filter((row) =>
    row.csts.includes(normalizedCst) &&
    `${row.code} ${row.description} ${row.note}`.toLocaleLowerCase("pt-BR").includes(term)
  );
}

export function benefitPeriod(row) {
  return row.end ? "Com data fim na tabela" : "Sem data fim informada";
}