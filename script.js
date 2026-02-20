const resultsBody = document.getElementById('resultsBody');
const addRowBtn = document.getElementById('addRowBtn');
const printBtn = document.getElementById('printBtn');

const totalItemsEl = document.getElementById('totalItems');
const totalPassEl = document.getElementById('totalPass');
const totalFailEl = document.getElementById('totalFail');
const passRateEl = document.getElementById('passRate');

const defaultRows = [
  {
    assetId: 'KET-001',
    appliance: 'Kettle',
    location: 'Kitchen',
    classType: 'I',
    visual: 'Pass',
    earth: '0.15',
    insulation: '2.4',
    polarity: 'Pass',
    leakage: '0.20',
    result: 'Pass'
  },
  {
    assetId: 'EXT-002',
    appliance: 'Extension Lead',
    location: 'Office',
    classType: 'I',
    visual: 'Pass',
    earth: '0.18',
    insulation: '1.8',
    polarity: 'Pass',
    leakage: '0.25',
    result: 'Pass'
  },
  {
    assetId: 'TOA-003',
    appliance: 'Toaster',
    location: 'Canteen',
    classType: 'I',
    visual: 'Fail',
    earth: '0.62',
    insulation: '0.7',
    polarity: 'Fail',
    leakage: '0.98',
    result: 'Fail'
  }
];

function selectOptions(options, selectedValue) {
  return options
    .map((option) => `<option value="${option}" ${option === selectedValue ? 'selected' : ''}>${option}</option>`)
    .join('');
}

function makeRow(data = {}) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="row-number"></td>
    <td><input type="text" name="assetId" value="${data.assetId || ''}" /></td>
    <td><input type="text" name="appliance" value="${data.appliance || ''}" /></td>
    <td><input type="text" name="location" value="${data.location || ''}" /></td>
    <td>
      <select name="classType">
        ${selectOptions(['I', 'II', 'III'], data.classType || 'I')}
      </select>
    </td>
    <td>
      <select name="visual">
        ${selectOptions(['Pass', 'Fail'], data.visual || 'Pass')}
      </select>
    </td>
    <td><input type="number" step="0.01" min="0" name="earth" value="${data.earth || ''}" /></td>
    <td><input type="number" step="0.01" min="0" name="insulation" value="${data.insulation || ''}" /></td>
    <td>
      <select name="polarity">
        ${selectOptions(['Pass', 'Fail', 'N/A'], data.polarity || 'Pass')}
      </select>
    </td>
    <td><input type="number" step="0.01" min="0" name="leakage" value="${data.leakage || ''}" /></td>
    <td>
      <select name="result" class="result-select">
        ${selectOptions(['Pass', 'Fail'], data.result || 'Pass')}
      </select>
    </td>
    <td>
      <button type="button" class="btn delete" aria-label="Delete row">Delete</button>
    </td>
  `;

  row.querySelector('.delete').addEventListener('click', () => {
    row.remove();
    renumberRows();
    updateTotals();
  });

  row.querySelector('.result-select').addEventListener('change', () => {
    paintResult(row);
    updateTotals();
  });

  paintResult(row);
  return row;
}

function paintResult(row) {
  const result = row.querySelector('.result-select').value;
  row.classList.remove('result-pass', 'result-fail');
  row.classList.add(result === 'Pass' ? 'result-pass' : 'result-fail');
}

function renumberRows() {
  [...resultsBody.rows].forEach((row, index) => {
    row.querySelector('.row-number').textContent = String(index + 1);
  });
}

function updateTotals() {
  const rows = [...resultsBody.rows];
  const totalItems = rows.length;
  const totalPass = rows.filter((row) => row.querySelector('.result-select').value === 'Pass').length;
  const totalFail = totalItems - totalPass;
  const passRate = totalItems === 0 ? 0 : Math.round((totalPass / totalItems) * 100);

  totalItemsEl.textContent = String(totalItems);
  totalPassEl.textContent = String(totalPass);
  totalFailEl.textContent = String(totalFail);
  passRateEl.textContent = `${passRate}%`;
}

function addRow(data = {}) {
  const row = makeRow(data);
  resultsBody.appendChild(row);
  renumberRows();
  updateTotals();
}

defaultRows.forEach((row) => addRow(row));

addRowBtn.addEventListener('click', () => addRow());
printBtn.addEventListener('click', () => window.print());
